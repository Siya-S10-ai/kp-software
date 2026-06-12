const express = require('express')
const {
  validateEnquiry,
  buildEnquiry,
  isValidStatusTransition,
} = require('../utils/enquiryHelpers')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.post('/', async (req, res) => {
  const validation = validateEnquiry(req.body)
  if (!validation.valid) {
    return res.status(400).json({ error: validation.errors.join('; ') })
  }

  const store = await getStore()
  const enquiry = buildEnquiry(req.body, store.generateId())
  const saved = await store.insert('enquiries', enquiry)
  res.status(201).json(saved)
})

router.get('/', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const enquiries = await store.find('enquiries')
  enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(enquiries)
})

router.get('/:id', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const enquiry = await store.findById('enquiries', req.params.id)
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
  res.json(enquiry)
})

router.patch('/:id', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const enquiry = await store.findById('enquiries', req.params.id)
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })

  const { status, internalNote } = req.body || {}
  const updates = {}

  if (status) {
    if (!isValidStatusTransition(enquiry.status, status)) {
      return res.status(400).json({
        error: `Cannot transition from ${enquiry.status} to ${status}`,
      })
    }
    updates.status = status
  }

  if (internalNote !== undefined) {
    updates.internalNote = internalNote
  }

  const updated = await store.updateById('enquiries', enquiry.id, updates)
  res.json(updated)
})

router.post('/:id/convert', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const enquiry = await store.findById('enquiries', req.params.id)
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })

  if (enquiry.status === 'converted') {
    return res.status(400).json({ error: 'Enquiry already converted' })
  }

  const now = new Date().toISOString()
  let customer = await store.findOne('customers', { email: enquiry.email })

  if (!customer) {
    customer = await store.insert('customers', {
      id: store.generateId(),
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      createdAt: now,
      updatedAt: now,
    })
  }

  const { title, description } = req.body || {}
  const project = await store.insert('projects', {
    id: store.generateId(),
    title: title || `${enquiry.service} — ${enquiry.name}`,
    description: description || enquiry.message,
    service: enquiry.service,
    status: 'planning',
    customerId: customer.id,
    enquiryId: enquiry.id,
    assignedWorkerIds: [],
    milestones: [
      {
        id: store.generateId(),
        title: 'Project kickoff',
        status: 'upcoming',
        dueDate: null,
      },
      {
        id: store.generateId(),
        title: 'Fabrication',
        status: 'upcoming',
        dueDate: null,
      },
      {
        id: store.generateId(),
        title: 'Delivery & installation',
        status: 'upcoming',
        dueDate: null,
      },
    ],
    isPublicPortfolio: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  })

  await store.updateById('enquiries', enquiry.id, { status: 'converted' })

  res.status(201).json({ project, customer })
})

module.exports = router
