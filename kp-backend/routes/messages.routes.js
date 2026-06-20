const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

async function getProjectAccess(store, user, projectId) {
  const project = await store.findById('projects', projectId)
  if (!project) {
    return { ok: false, status: 404, error: 'Project not found' }
  }

  if (ADMIN_ROLES.includes(user.role)) {
    return { ok: true, project }
  }

  if (user.role === ROLES.WORKER) {
    if (!project.assignedWorkerIds?.includes(user.workerId)) {
      return { ok: false, status: 403, error: 'Not assigned to this project' }
    }
    return { ok: true, project }
  }

  if (user.role === ROLES.CUSTOMER) {
    if (project.customerId !== user.customerId) {
      return { ok: false, status: 403, error: 'Not your project' }
    }
    return { ok: true, project }
  }

  return { ok: false, status: 403, error: 'Insufficient permissions' }
}

function authorRoleForUser(user) {
  return user.role === ROLES.CUSTOMER ? 'customer' : 'worker'
}

router.get('/', authenticate, async (req, res) => {
  const { projectId } = req.query
  if (!projectId) {
    return res.status(400).json({ error: 'projectId query parameter is required' })
  }

  const store = await getStore()
  const access = await getProjectAccess(store, req.user, projectId)
  if (!access.ok) {
    return res.status(access.status).json({ error: access.error })
  }

  let messages = await store.find('projectMessages', { projectId })
  messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  res.json(messages)
})

router.post(
  '/',
  authenticate,
  requireRoles(ROLES.WORKER, ROLES.CUSTOMER),
  async (req, res) => {
    const { projectId, text, parentMessageId } = req.body || {}
    const trimmedText = typeof text === 'string' ? text.trim() : ''
    if (!projectId || !trimmedText) {
      return res.status(400).json({ error: 'projectId and text are required' })
    }

    const store = await getStore()
    const access = await getProjectAccess(store, req.user, projectId)
    if (!access.ok) {
      return res.status(access.status).json({ error: access.error })
    }

    if (parentMessageId) {
      const parent = await store.findById('projectMessages', parentMessageId)
      if (!parent) {
        return res.status(404).json({ error: 'Parent message not found' })
      }
      if (parent.projectId !== projectId) {
        return res.status(400).json({ error: 'Parent message belongs to a different project' })
      }
      const myRole = authorRoleForUser(req.user)
      if (parent.authorId === req.user.id) {
        return res.status(403).json({ error: 'You cannot reply to your own message' })
      }
      if (parent.authorRole === myRole) {
        return res.status(403).json({ error: 'You can only reply to messages from the other party' })
      }
    }

    const now = new Date().toISOString()
    const message = await store.insert('projectMessages', {
      id: store.generateId(),
      projectId,
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: authorRoleForUser(req.user),
      text: trimmedText,
      parentMessageId: parentMessageId || null,
      createdAt: now,
      updatedAt: now,
    })

    res.status(201).json(message)
  }
)

router.patch(
  '/:id',
  authenticate,
  requireRoles(ROLES.WORKER, ROLES.CUSTOMER),
  async (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
    if (!text) {
      return res.status(400).json({ error: 'text is required' })
    }

    const store = await getStore()
    const message = await store.findById('projectMessages', req.params.id)
    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const access = await getProjectAccess(store, req.user, message.projectId)
    if (!access.ok) {
      return res.status(access.status).json({ error: access.error })
    }

    if (message.authorId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own messages' })
    }

    const updated = await store.updateById('projectMessages', message.id, { text })
    res.json(updated)
  }
)

module.exports = router
