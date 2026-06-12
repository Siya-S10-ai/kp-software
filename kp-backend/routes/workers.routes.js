const express = require('express')
const { getStore } = require('../store')
const { authenticate, requireRoles } = require('../middleware/auth')
const { ADMIN_ROLES } = require('../config/constants')

const router = express.Router()

router.get('/', authenticate, requireRoles(...ADMIN_ROLES), async (req, res) => {
  const store = await getStore()
  const workers = await store.find('workers')
  res.json(workers)
})

module.exports = router
