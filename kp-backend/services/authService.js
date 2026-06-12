const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getStore } = require('../store')

function getJwtSecret() {
  return process.env.JWT_SECRET || 'kp-dev-secret-change-in-production'
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

async function login(email, password) {
  const store = await getStore()
  const user = await store.findOne('users', {
    email: email.toLowerCase().trim(),
  })

  if (!user) {
    return { error: 'Invalid email or password', status: 401 }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: 'Invalid email or password', status: 401 }
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    getJwtSecret(),
    { expiresIn: '24h' }
  )

  return { token, user: sanitizeUser(user) }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret())
  } catch {
    return null
  }
}

module.exports = {
  login,
  verifyToken,
  sanitizeUser,
  getJwtSecret,
}
