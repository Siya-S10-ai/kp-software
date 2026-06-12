const express = require('express')
const cors = require('cors')
const { getStore } = require('./store')
const { seedDatabase } = require('./services/seed')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const enquiryRoutes = require('./routes/enquiries.routes')
const projectRoutes = require('./routes/projects.routes')
const taskRoutes = require('./routes/tasks.routes')
const progressRoutes = require('./routes/progress.routes')
const mediaRoutes = require('./routes/media.routes')
const reviewRoutes = require('./routes/reviews.routes')
const customerRoutes = require('./routes/customers.routes')
const workerRoutes = require('./routes/workers.routes')
const publicRoutes = require('./routes/public.routes')

let initialized = false

async function initializeApp() {
  if (initialized) return
  const store = await getStore()
  await seedDatabase(store)
  initialized = true
}

function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '5mb' }))

  app.get('/', (req, res) => {
    res.send('Backend is running!')
  })

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/enquiries', enquiryRoutes)
  app.use('/api/projects', projectRoutes)
  app.use('/api/tasks', taskRoutes)
  app.use('/api/progress-updates', progressRoutes)
  app.use('/api/media', mediaRoutes)
  app.use('/api/reviews', reviewRoutes)
  app.use('/api/customers', customerRoutes)
  app.use('/api/workers', workerRoutes)
  app.use('/api/public', publicRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  app.ready = initializeApp

  return app
}

module.exports = createApp
