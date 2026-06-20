const request = require('supertest')
const createApp = require('../app')
const { getStore, resetStore } = require('../store')

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

describe('project messages', () => {
  it('enforces reply permissions and author-only edits', async () => {
    const workerToken = await loginAs('worker@kp.com')
    const customerToken = await loginAs('customer@kp.com')

    const projects = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${customerToken}`)
    const projectId = projects.body[0].id

    const workerMessage = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        text: 'Initial worker update',
      })
    expect(workerMessage.status).toBe(201)

    const workerOwnReply = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        text: 'Replying to myself',
        parentMessageId: workerMessage.body.id,
      })
    expect(workerOwnReply.status).toBe(403)

    const customerReply = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        projectId,
        text: 'Thanks for the update',
        parentMessageId: workerMessage.body.id,
      })
    expect(customerReply.status).toBe(201)

    const workerCustomerReply = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        text: 'Happy to help',
        parentMessageId: customerReply.body.id,
      })
    expect(workerCustomerReply.status).toBe(201)

    const customerOwnReply = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        projectId,
        text: 'Replying to my own reply',
        parentMessageId: customerReply.body.id,
      })
    expect(customerOwnReply.status).toBe(403)

    const store = await getStore()
    const now = new Date().toISOString()
    const otherWorkerMessage = await store.insert('projectMessages', {
      id: store.generateId(),
      projectId,
      authorId: 'another-worker-user',
      authorName: 'Another Worker',
      authorRole: 'worker',
      text: 'Same side update',
      parentMessageId: null,
      createdAt: now,
      updatedAt: now,
    })

    const workerSameRoleReply = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        projectId,
        text: 'Replying to another worker',
        parentMessageId: otherWorkerMessage.id,
      })
    expect(workerSameRoleReply.status).toBe(403)

    const editOwn = await request(app)
      .patch(`/api/messages/${workerMessage.body.id}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ text: 'Updated worker message' })
    expect(editOwn.status).toBe(200)
    expect(editOwn.body.text).toBe('Updated worker message')

    const editSomeoneElse = await request(app)
      .patch(`/api/messages/${workerMessage.body.id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ text: 'Customer edit attempt' })
    expect(editSomeoneElse.status).toBe(403)
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
