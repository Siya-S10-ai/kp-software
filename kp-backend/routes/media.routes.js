const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const store = await getStore()
  let files = await store.find('mediaFiles')

  if (req.query.projectId) {
    files = files.filter((f) => f.projectId === req.query.projectId)
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
    files = files.filter((f) => assignedIds.has(f.projectId))
  } else if (req.user.role === ROLES.CUSTOMER) {
    const projects = await store.find('projects', { customerId: req.user.customerId })
    const projectIds = new Set(projects.map((p) => p.id))
    files = files.filter(
      (f) => projectIds.has(f.projectId) && f.visibleToCustomer
    )
  } else {
    files = []
  }

  res.json(files)
})

router.post('/', authenticate, requireRoles(ROLES.WORKER, ...ADMIN_ROLES), async (req, res) => {
  const { projectId, taskId, fileName, mimeType, dataUrl, caption, visibleToCustomer } =
    req.body || {}

  if (!projectId || !fileName || !dataUrl) {
    return res.status(400).json({ error: 'projectId, fileName, and dataUrl are required' })
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
  const file = await store.insert('mediaFiles', {
    id: store.generateId(),
    projectId,
    taskId: taskId || null,
    uploadedBy: req.user.id,
    fileName,
    mimeType: mimeType || 'image/jpeg',
    dataUrl,
    caption: caption?.trim() || '',
    visibleToCustomer: visibleToCustomer !== false,
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(file)
})

module.exports = router
