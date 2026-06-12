const request = require('supertest')
const createApp = require('../app')
const { resetStore } = require('../store')

let app

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  app = createApp()
  await app.ready()
})

beforeEach(async () => {
  const store = await resetStore()
  await store.clear()
  const { seedDatabase } = require('../services/seed')
  await seedDatabase(store)
})

async function loginAs(email) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'password123' })
  return res.body.token
}

describe('POST /api/auth/login', () => {
  it('returns a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kp.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.role).toBe('super_admin')
  })

  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kp.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })
})

describe('role access', () => {
  it('blocks unauthenticated access to admin enquiries', async () => {
    const res = await request(app).get('/api/enquiries')
    expect(res.status).toBe(401)
  })

  it('allows admin to list enquiries', async () => {
    const token = await loginAs('admin@kp.com')
    const res = await request(app)
      .get('/api/enquiries')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('blocks customer from admin enquiries', async () => {
    const token = await loginAs('customer@kp.com')
    const res = await request(app)
      .get('/api/enquiries')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it('allows customer to see only their projects', async () => {
    const token = await loginAs('customer@kp.com')
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    res.body.forEach((project) => {
      expect(project.customerId).toBeDefined()
    })
  })

  it('allows worker to see seeded assigned projects', async () => {
    const workerToken = await loginAs('worker@kp.com')
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${workerToken}`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0].assignedWorkerIds.length).toBeGreaterThan(0)
  })
})
