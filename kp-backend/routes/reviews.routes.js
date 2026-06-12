const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles, optionalAuth } = require('../middleware/auth')
const { ROLES, ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.get('/', optionalAuth, async (req, res) => {
  const store = await getStore()
  let reviews = await store.find('reviews')

  const isAdmin = req.user && ADMIN_ROLES.includes(req.user.role)
  if (!isAdmin) {
    reviews = reviews.filter((r) => r.status === 'approved')
  } else if (req.query.status) {
    reviews = reviews.filter((r) => r.status === req.query.status)
  }

  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(
    reviews.map(({ id, projectId, authorName, rating, title, body, status, createdAt }) => ({
      id,
      projectId,
      authorName,
      rating,
      title,
      body,
      status: isAdmin ? status : undefined,
      createdAt,
    }))
  )
})

router.post('/', authenticate, requireRoles(ROLES.CUSTOMER), async (req, res) => {
  const { projectId, rating, title, body } = req.body || {}

  if (!projectId || !rating || !body?.trim()) {
    return res.status(400).json({ error: 'projectId, rating, and body are required' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' })
  }

  const store = await getStore()
  const project = await store.findById('projects', projectId)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  if (project.customerId !== req.user.customerId) {
    return res.status(403).json({ error: 'You can only review your own projects' })
  }

  if (project.status !== 'completed') {
    return res.status(400).json({ error: 'Project must be completed before reviewing' })
  }

  const existing = await store.findOne('reviews', { projectId, customerId: req.user.customerId })
  if (existing) {
    return res.status(400).json({ error: 'You have already reviewed this project' })
  }

  const now = new Date().toISOString()
  const review = await store.insert('reviews', {
    id: store.generateId(),
    projectId,
    customerId: req.user.customerId,
    authorName: req.user.name,
    rating: Number(rating),
    title: title?.trim() || '',
    body: body.trim(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(review)
})

router.patch('/:id/moderate', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const { status } = req.body || {}
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' })
  }

  const store = await getStore()
  const review = await store.findById('reviews', req.params.id)
  if (!review) return res.status(404).json({ error: 'Review not found' })

  const updated = await store.updateById('reviews', review.id, { status })
  res.json(updated)
})

router.post('/:id/comments', authenticate, requireRoles(ROLES.CUSTOMER), async (req, res) => {
  const { body } = req.body || {}
  if (!body?.trim()) return res.status(400).json({ error: 'body is required' })

  const store = await getStore()
  const review = await store.findById('reviews', req.params.id)
  if (!review) return res.status(404).json({ error: 'Review not found' })

  if (review.customerId !== req.user.customerId) {
    return res.status(403).json({ error: 'You can only comment on your own reviews' })
  }

  const now = new Date().toISOString()
  const comment = await store.insert('reviewComments', {
    id: store.generateId(),
    reviewId: review.id,
    authorId: req.user.id,
    authorName: req.user.name,
    body: body.trim(),
    createdAt: now,
    updatedAt: now,
  })

  res.status(201).json(comment)
})

router.get('/:id/comments', async (req, res) => {
  const store = await getStore()
  const review = await store.findById('reviews', req.params.id)
  if (!review) return res.status(404).json({ error: 'Review not found' })
  if (review.status !== 'approved') {
    return res.status(404).json({ error: 'Review not found' })
  }

  const comments = await store.find('reviewComments', { reviewId: review.id })
  res.json(comments)
})

module.exports = router
