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

describe('lead to project workflow', () => {
  it('converts an enquiry into a project', async () => {
    const enquiryRes = await request(app).post('/api/enquiries').send({
      name: 'New Lead',
      email: 'newlead@example.com',
      service: 'structural-steel',
      message: 'Need structural steel for a warehouse extension.',
    })
    expect(enquiryRes.status).toBe(201)

    const adminToken = await loginAs('admin@kp.com')
    const convertRes = await request(app)
      .post(`/api/enquiries/${enquiryRes.body.id}/convert`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Warehouse Extension' })

    expect(convertRes.status).toBe(201)
    expect(convertRes.body.project.title).toBe('Warehouse Extension')
    expect(convertRes.body.customer.email).toBe('newlead@example.com')
  })
})

describe('worker assignment and task updates', () => {
  it('assigns a worker and updates task status', async () => {
    const adminToken = await loginAs('admin@kp.com')
    const workerToken = await loginAs('worker@kp.com')

    const workers = await request(app)
      .get('/api/workers')
      .set('Authorization', `Bearer ${adminToken}`)
    const workerId = workers.body[0].id

    const customers = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
    const customerId = customers.body[0].id

    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Fabrication Job',
        customerId,
        service: 'custom-fabrication',
      })
    const projectId = projectRes.body.id

    await request(app)
      .post(`/api/projects/${projectId}/assign-workers`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ workerIds: [workerId] })

    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        projectId,
        title: 'Cut steel panels',
        assignedWorkerId: workerId,
      })
    expect(taskRes.status).toBe(201)

    const updateRes = await request(app)
      .patch(`/api/tasks/${taskRes.body.id}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ status: 'in_progress' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.status).toBe('in_progress')
  })
})

describe('customer visibility', () => {
  it('shows customer-visible progress updates only', async () => {
    const adminToken = await loginAs('admin@kp.com')
    const customerToken = await loginAs('customer@kp.com')
    const workerToken = await loginAs('worker@kp.com')

    const projects = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${customerToken}`)
    const projectId = projects.body[0].id

    await request(app)
      .post('/api/progress-updates')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        note: 'Internal weld inspection complete',
        visibleToCustomer: false,
      })

    await request(app)
      .post('/api/progress-updates')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        note: 'Gate frame assembled — ready for powder coating',
        visibleToCustomer: true,
      })

    const customerUpdates = await request(app)
      .get(`/api/progress-updates?projectId=${projectId}`)
      .set('Authorization', `Bearer ${customerToken}`)

    expect(customerUpdates.body.length).toBe(1)
    expect(customerUpdates.body[0].note).toMatch(/powder coating/i)
  })
})

describe('review submission', () => {
  it('allows customer to submit a review for completed project', async () => {
    const adminToken = await loginAs('admin@kp.com')
    const customerToken = await loginAs('customer@kp.com')

    const customers = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
    const customerId = customers.body[0].id

    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Balustrade Installation',
        customerId,
        service: 'handrails-balustrades',
      })
    const projectId = projectRes.body.id

    await request(app)
      .patch(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed', isPublicPortfolio: true })

    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        projectId,
        rating: 5,
        title: 'Great work',
        body: 'The team did an excellent job on our balustrade project.',
      })

    expect(reviewRes.status).toBe(201)
    expect(reviewRes.body.status).toBe('pending')

    const moderateRes = await request(app)
      .patch(`/api/reviews/${reviewRes.body.id}/moderate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' })
    expect(moderateRes.body.status).toBe('approved')

    const publicReviews = await request(app).get('/api/reviews')
    expect(publicReviews.body.some((r) => r.id === reviewRes.body.id)).toBe(true)
  })
})
