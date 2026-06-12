const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const store = await getStore()
  let updates = await store.find('progressUpdates')

  if (req.query.projectId) {
    updates = updates.filter((u) => u.projectId === req.query.projectId)
  }

  if (ADMIN_ROLES.includes(req.user.role)) {
    // full access
  } else if (req.user.role === ROLES.WORKER) {
    const projects = await store.find('projects')
    const assignedIds = new Set(
      projects
        .filter((p) => p.assignedWorkerIds?.includes(req.user.workerId))
        .map((p) => p.id)
    )
    updates = updates.filter((u) => assignedIds.has(u.projectId))
  } else if (req.user.role === ROLES.CUSTOMER) {
    const projects = await store.find('projects', { customerId: req.user.customerId })
    const projectIds = new Set(projects.map((p) => p.id))
    updates = updates.filter(
      (u) => projectIds.has(u.projectId) && u.visibleToCustomer
    )
  } else {
    updates = []
  }

  updates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(updates)
})

router.post('/', authenticate, requireRoles(ROLES.WORKER, ...ADMIN_ROLES), async (req, res) => {
  const { projectId, taskId, note, visibleToCustomer } = req.body || {}
  if (!projectId || !note?.trim()) {
    return res.status(400).json({ error: 'projectId and note are required' })
  }

  const store = await getStore()
  const project = await store.findById('projects', projectId)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  if (
    req.user.role === ROLES.WORKER &&
    !project.assignedWorkerIds?.includes(req.user.workerId)
  ) {
    return res.status(403).json({ error: 'Not assigned to this project' })
  }

  const now = new Date().toISOString()
  const update = await store.insert('progressUpdates', {
    id: store.generateId(),
    projectId,
    taskId: taskId || null,
    authorId: req.user.id,
    authorName: req.user.name,
    note: note.trim(),
    visibleToCustomer: visibleToCustomer !== false,
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(update)
})

module.exports = router
