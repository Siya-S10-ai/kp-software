const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.get('/', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const customers = await store.find('customers')
  res.json(customers)
})

router.get('/:id', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const customer = await store.findById('customers', req.params.id)
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  res.json(customer)
})

module.exports = router
