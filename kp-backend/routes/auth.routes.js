const express = require('express')
const { login } = require('../services/authService')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const result = await login(email, password)
  if (result.error) {
    return res.status(result.status).json({ error: result.error })
  }

  res.json(result)
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
