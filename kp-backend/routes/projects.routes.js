const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES, PROJECT_STATUSES } = require('../config/constants')

const router = express.Router()

function canAccessProject(user, project) {
  if (ADMIN_ROLES.includes(user.role)) return true
  if (user.role === ROLES.CUSTOMER && user.customerId === project.customerId) return true
  if (user.role === ROLES.WORKER && project.assignedWorkerIds?.includes(user.workerId)) {
    return true
  }
  return false
}

function sanitizeProjectForRole(user, project) {
  const base = { ...project }
  if (user.role === ROLES.CUSTOMER) {
    delete base.internalNotes
  }
  return base
}

router.get('/', authenticate, async (req, res) => {
  const store = await getStore()
  let projects = await store.find('projects')

  if (userFilter(req.user)) {
    projects = projects.filter((p) => userFilter(req.user)(p))
  }

  projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(projects.map((p) => sanitizeProjectForRole(req.user, p)))
})

function userFilter(user) {
  if (ADMIN_ROLES.includes(user.role)) return null
  if (user.role === ROLES.CUSTOMER) {
    return (p) => p.customerId === user.customerId
  }
  if (user.role === ROLES.WORKER) {
    return (p) => p.assignedWorkerIds?.includes(user.workerId)
  }
  return () => false
}

router.get('/portfolio', async (req, res) => {
  const store = await getStore()
  const projects = await store.find('projects', {
    status: 'completed',
    isPublicPortfolio: true,
  })
  res.json(
    projects.map(({ id, title, description, service, completedAt }) => ({
      id,
      title,
      description,
      service,
      completedAt,
    }))
  )
})

router.get('/:id', authenticate, async (req, res) => {
  const store = await getStore()
  const project = await store.findById('projects', req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (!canAccessProject(req.user, project)) {
    return res.status(403).json({ error: 'Access denied' })
  }
  res.json(sanitizeProjectForRole(req.user, project))
})

router.post('/', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const { title, description, service, customerId, status } = req.body || {}
  if (!title || !customerId) {
    return res.status(400).json({ error: 'title and customerId are required' })
  }

  const store = await getStore()
  const customer = await store.findById('customers', customerId)
  if (!customer) return res.status(400).json({ error: 'Customer not found' })

  const now = new Date().toISOString()
  const project = await store.insert('projects', {
    id: store.generateId(),
    title: title.trim(),
    description: description?.trim() || '',
    service: service || 'other',
    status: status && PROJECT_STATUSES.includes(status) ? status : 'planning',
    customerId,
    enquiryId: null,
    assignedWorkerIds: [],
    milestones: [],
    isPublicPortfolio: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  })

  res.status(201).json(project)
})

router.patch('/:id', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const project = await store.findById('projects', req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const allowed = ['title', 'description', 'status', 'isPublicPortfolio', 'milestones']
  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }

  if (updates.status === 'completed') {
    updates.completedAt = new Date().toISOString()
  }

  const updated = await store.updateById('projects', project.id, updates)
  res.json(updated)
})

router.post('/:id/assign-workers', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const project = await store.findById('projects', req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const { workerIds } = req.body || {}
  if (!Array.isArray(workerIds) || workerIds.length === 0) {
    return res.status(400).json({ error: 'workerIds array is required' })
  }

  for (const workerId of workerIds) {
    const worker = await store.findById('workers', workerId)
    if (!worker) return res.status(400).json({ error: `Worker ${workerId} not found` })
  }

  const merged = [...new Set([...(project.assignedWorkerIds || []), ...workerIds])]
  const updated = await store.updateById('projects', project.id, {
    assignedWorkerIds: merged,
    status: project.status === 'planning' ? 'in_progress' : project.status,
  })

  res.json(updated)
})

module.exports = router
