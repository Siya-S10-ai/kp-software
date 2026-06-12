const { verifyToken, sanitizeUser } = require('../services/authService')
const { getStore } = require('../store')

async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const payload = verifyToken(header.slice(7))
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const store = await getStore()
  const user = await store.findById('users', payload.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  req.user = sanitizeUser(user)
  next()
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return next()
  }

  const payload = verifyToken(header.slice(7))
  if (!payload) return next()

  getStore()
    .then((store) => store.findById('users', payload.userId))
    .then((user) => {
      if (user) req.user = sanitizeUser(user)
      next()
    })
    .catch(next)
}

module.exports = { authenticate, requireRoles, optionalAuth }
