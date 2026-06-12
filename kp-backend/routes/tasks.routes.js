const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES, TASK_STATUSES } = require('../config/constants')

const router = express.Router()

async function canAccessTask(user, task, store) {
  if (ADMIN_ROLES.includes(user.role)) return true
  if (user.role === ROLES.WORKER && task.assignedWorkerId === user.workerId) return true
  if (user.role === ROLES.CUSTOMER) {
    const project = await store.findById('projects', task.projectId)
    return project?.customerId === user.customerId
  }
  return false
}

router.get('/', authenticate, async (req, res) => {
  const store = await getStore()
  let tasks = await store.find('tasks')

  if (ADMIN_ROLES.includes(req.user.role)) {
    if (req.query.projectId) {
      tasks = tasks.filter((t) => t.projectId === req.query.projectId)
    }
  } else if (req.user.role === ROLES.WORKER) {
    tasks = tasks.filter((t) => t.assignedWorkerId === req.user.workerId)
  } else if (req.user.role === ROLES.CUSTOMER) {
    const projects = await store.find('projects', { customerId: req.user.customerId })
    const projectIds = new Set(projects.map((p) => p.id))
    tasks = tasks.filter((t) => projectIds.has(t.projectId))
  } else {
    tasks = []
  }

  res.json(tasks)
})

router.post('/', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const { projectId, title, description, assignedWorkerId, dueDate } = req.body || {}
  if (!projectId || !title) {
    return res.status(400).json({ error: 'projectId and title are required' })
  }

  const store = await getStore()
  const project = await store.findById('projects', projectId)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  if (assignedWorkerId) {
    const worker = await store.findById('workers', assignedWorkerId)
    if (!worker) return res.status(400).json({ error: 'Worker not found' })
  }

  const now = new Date().toISOString()
  const task = await store.insert('tasks', {
    id: store.generateId(),
    projectId,
    title: title.trim(),
    description: description?.trim() || '',
    status: 'pending',
    assignedWorkerId: assignedWorkerId || null,
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(task)
})

router.patch('/:id', authenticate, async (req, res) => {
  const store = await getStore()
  const task = await store.findById('tasks', req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const isAdmin = ADMIN_ROLES.includes(req.user.role)
  const isAssignedWorker =
    req.user.role === ROLES.WORKER && task.assignedWorkerId === req.user.workerId

  if (!isAdmin && !isAssignedWorker) {
    return res.status(403).json({ error: 'Access denied' })
  }

  const updates = {}
  if (req.body.status) {
    if (!TASK_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid task status' })
    }
    updates.status = req.body.status
  }

  if (isAdmin) {
    if (req.body.title) updates.title = req.body.title
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.assignedWorkerId !== undefined) updates.assignedWorkerId = req.body.assignedWorkerId
  }

  const updated = await store.updateById('tasks', task.id, updates)
  res.json(updated)
})

module.exports = router
