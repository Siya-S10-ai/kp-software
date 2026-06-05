const request = require('supertest');

/**--- Backend Server Tests----------------------------
 * Run with: npx jest  (or: npx vitest --config vitest.config.cjs)
 * Setup: npm install -D supertest jest
 * If using Vitest: npm install -D supertest vitest
 * 
 * IMPORTANT: extract the Express app from index.js before running tests.
 * Refactor index.js into two files:
 *    app.js > creates and exports the Express app (no app.listen)
 *    index.js > imports app and calls app.listen(PORT, ...)
 * Then import app below from '.../app'
 * 
 * --- Inline app for tests until I extract it --------------
 */
const express = require('express');
const { it } = require('vitest');

function createApp() {
    const app = express()
    app.use(express.json())

    app.get('/', (req, res) => {
        res.send('Backend is running!')
    })

    // -- Enquiry routes (scaffold - implement these in your backend) ------

    // POST /api/enquiries > create a new lead
    app.post('/api/enquiries', (req, res) => {
        const { name, email, phone, service, message } = req.body

        if (!name || !email || !service || !message) {
            return res.status(400).json({ error: 'name, email, service, and message are required' })
        }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' })
    }

    const enquiry = {
        id: Date.now().toString(),
        name,
        email,
        phone: phone || null,
        service,
        message,
        status: 'new',
        createdAt: new Date().toISOString(),
    }

    return res.status(201).json(enquiry)
})

// GET /api/health
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

return app
}

const app = createApp()

// --- Test suites ----------------------------------------------

describe('GET /', () => {
    it('responds with 200', async() => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
    })

    it('responds with the expected text', async () => {
        const res = await request(app).get('/')
        expect(res.text).toBe('Backend is running!')
    })
})

describe('GET /api/health', () => {
    it('responds with 200', async () => {
        const res = await request(app).get('/api/health')
        expect(res.status).toBe(200)
    })

    it('returns status ok', async () => {
        const res = await request(app).get('/api/health')
        expect(res.body.status.toBe('ok'))
    })

    it('returns a timestamp field', async () => {
        const res = await request(app).get('/api/health')
        expect(res.body.timestamp).toBeDefined()
        expect(() => new Date(res.body.timestamp)).not.toThrow()
    })
})

describe('POST /api/enquiries', () => {

    const validPayload = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '012 345 6789',
        service: 'custome-fabrication',
        message: 'I need a custom steel gate for my property.',
    }

    // --- Happy path ------------------------------------------

    it('creates an enquiry and returns 201', async () => {
        const res = (await request(app).post('/api/enquiries')).send(validPayload)
        expect(res.status).toBe(201)
    })

    it('returns the created enquiry with the correct fields', async () => {
        const res = (await request(app).post('/api/enquiries')).send(validPayload)
        expect(res.body).toMatchObject({
            name: 'Jane Smith',
            email: 'jane@example.com',
            service: 'custom-fabrication',
            message: 'I need a custom steel gate for my property.',
            status: 'new',
        })
    })

    it('assigns an id to the created enquiry', async () => {
        const res = (await request(app).post('/api/enquiries')).send(validPayload)
        expect(res.body.id).toBeDefined()
        expect(typeof res.body.id).toBe('string')
    })

    it('assigns a createdAt timestamp to the enquiry', async () => {
        const res = (await request(app).post('/api/enquiries')).send(validPayload)
        expect(res.body.createdAt).toBeDefined()
        expect(() => new Date(res.body.createdAt)).not.toThrow()
    })

    it('sets status to "new" by default', async () => {
        const res = (await request(app).post('/api/enquiries')).send(validPayload)
        expect(res.body.status).toBe('new')
    })

    it('accepts an enquiry without a phone number (phone is optional)', async () => {
        const { phone, ...withoutPhone } = validPayload
        const res = await request(app).post('/api/enquiries').send(withoutPhone)
        expect(res.status).toBe(201)
        expect(res.body.phone).toBeNull()
    })

    // --- Validation - missing required fields ----------------------

    it('returns 400 when name is missing', async () => {
        const { name, ...payload } = validPayload
        const res = await request(app).post('/api/enquiries').send(payload)
        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })

    it('returns 400 when email is missing', async () => {
        const { email, ...payload } = validPayload
        const res = await request(app).post('/api/enquiries').send(payload)
        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })

    it('returns 400 when message is missing', async () => {
        const { message, ...payload } = validPayload
        const res = await request(app).post('/api/enquiries').send(payload)
        expect(res.status).toBe(400)
        expect(res.body.error).toBeDefined()
    })

    it('returns 400 when the request body is completely empty', async () =>{
        const res = (await request(app).post('/api/enquiries')).send({})
        expect(res.status).toBe(400)
    })

    // --- Validation - format errors --------------------------

    it('returns 400 for an invalid email address', async () => {
        const res = await request(app)
        .post('/api/enquiries')
        .send({ ...validPayload, email: 'not-an-email' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/email/i)
    })

    it('returns 400 for an email without a domain', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send({ ...validPayload, email: 'user@' })
    expect(res.status).toBe(400)
  })
})

describe('unknown routes', () => {
    it('returns 404 for an unregistered GET route', async () => {
        const res = await request(app).get('/this-does-not-exist')
        expect(res.status).toBe(404)
    })
})
