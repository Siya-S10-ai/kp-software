import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const {
  validateEnquiry,
  buildEnquiry,
  isValidStatusTransition,
  formatEnquiryForClient,
  VALID_SERVICES,
  ENQUIRY_STATUSES,
} = require('../../kp-backend/utils/enquiryHelpers.js')

// ─── Enquiry Helper Unit Tests ─────────────────────────────────────────────────
// Run with: npx jest src/utils/enquiryHelpers.test.js
// These test pure functions only — no HTTP, no database, no side effects.

// ─── validateEnquiry ──────────────────────────────────────────────────────────

describe('validateEnquiry', () => {

  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    service: 'custom-fabrication',
    message: 'I need a custom steel frame for my warehouse.',
  }

  describe('valid payloads', () => {
    it('returns valid: true for a complete valid payload', () => {
      const result = validateEnquiry(validData)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('returns valid: true when phone is provided and valid', () => {
      const result = validateEnquiry({ ...validData, phone: '071 234 5678' })
      expect(result.valid).toBe(true)
    })

    it('returns valid: true when phone is omitted entirely', () => {
      const result = validateEnquiry(validData)
      expect(result.valid).toBe(true)
    })

    it('returns valid: true when phone is explicitly null', () => {
      const result = validateEnquiry({ ...validData, phone: null })
      expect(result.valid).toBe(true)
    })

    it('accepts all valid service types', () => {
      VALID_SERVICES.forEach(service => {
        const result = validateEnquiry({ ...validData, service })
        expect(result.valid).toBe(true)
      })
    })
  })

  describe('name validation', () => {
    it('fails when name is missing', () => {
      const { name, ...data } = validData
      const result = validateEnquiry(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('name is required')
    })

    it('fails when name is an empty string', () => {
      const result = validateEnquiry({ ...validData, name: '' })
      expect(result.valid).toBe(false)
    })

    it('fails when name is only whitespace', () => {
      const result = validateEnquiry({ ...validData, name: '   ' })
      expect(result.valid).toBe(false)
    })

    it('fails when name is shorter than 2 characters', () => {
      const result = validateEnquiry({ ...validData, name: 'A' })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/at least 2/i)
    })

    it('fails when name exceeds 100 characters', () => {
      const result = validateEnquiry({ ...validData, name: 'A'.repeat(101) })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/100 characters/i)
    })

    it('passes for a name of exactly 2 characters', () => {
      const result = validateEnquiry({ ...validData, name: 'Jo' })
      expect(result.valid).toBe(true)
    })

    it('passes for a name of exactly 100 characters', () => {
      const result = validateEnquiry({ ...validData, name: 'A'.repeat(100) })
      expect(result.valid).toBe(true)
    })
  })

  describe('email validation', () => {
    it('fails when email is missing', () => {
      const { email, ...data } = validData
      const result = validateEnquiry(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('email is required')
    })

    it('fails for an email without @', () => {
      const result = validateEnquiry({ ...validData, email: 'notanemail' })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/valid email/i)
    })

    it('fails for an email without a domain', () => {
      const result = validateEnquiry({ ...validData, email: 'user@' })
      expect(result.valid).toBe(false)
    })

    it('fails for an email without a local part', () => {
      const result = validateEnquiry({ ...validData, email: '@example.com' })
      expect(result.valid).toBe(false)
    })

    it('passes for a valid email with subdomain', () => {
      const result = validateEnquiry({ ...validData, email: 'user@mail.example.co.uk' })
      expect(result.valid).toBe(true)
    })
  })

  describe('service validation', () => {
    it('fails when service is missing', () => {
      const { service, ...data } = validData
      const result = validateEnquiry(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('service is required')
    })

    it('fails for an unrecognised service type', () => {
      const result = validateEnquiry({ ...validData, service: 'underwater-basket-weaving' })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/one of/i)
    })
  })

  describe('message validation', () => {
    it('fails when message is missing', () => {
      const { message, ...data } = validData
      const result = validateEnquiry(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('message is required')
    })

    it('fails when message is fewer than 10 characters', () => {
      const result = validateEnquiry({ ...validData, message: 'Hi' })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/at least 10/i)
    })

    it('fails when message exceeds 2000 characters', () => {
      const result = validateEnquiry({ ...validData, message: 'x'.repeat(2001) })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/2000 characters/i)
    })

    it('passes for a message of exactly 10 characters', () => {
      const result = validateEnquiry({ ...validData, message: '1234567890' })
      expect(result.valid).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('returns errors array even when payload is null', () => {
      const result = validateEnquiry(null)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
    })

    it('collects multiple errors at once', () => {
      const result = validateEnquiry({ name: '', email: 'bad' })
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })
})

// ─── buildEnquiry ─────────────────────────────────────────────────────────────

describe('buildEnquiry', () => {
  const data = {
    name: '  Jane Smith  ',
    email: '  JANE@EXAMPLE.COM  ',
    phone: '  0412 345 678  ',
    service: 'gates-fencing',
    message: '  I need a gate for the driveway.  ',
  }

  it('trims whitespace from name', () => {
    const enquiry = buildEnquiry(data, 'test-id')
    expect(enquiry.name).toBe('Jane Smith')
  })

  it('lowercases and trims the email', () => {
    const enquiry = buildEnquiry(data, 'test-id')
    expect(enquiry.email).toBe('jane@example.com')
  })

  it('trims whitespace from message', () => {
    const enquiry = buildEnquiry(data, 'test-id')
    expect(enquiry.message).toBe('I need a gate for the driveway.')
  })

  it('sets status to "new"', () => {
    const enquiry = buildEnquiry(data, 'test-id')
    expect(enquiry.status).toBe(ENQUIRY_STATUSES.NEW)
  })

  it('uses the provided id override', () => {
    const enquiry = buildEnquiry(data, 'fixed-id-123')
    expect(enquiry.id).toBe('fixed-id-123')
  })

  it('sets phone to null when phone is not provided', () => {
    const { phone, ...withoutPhone } = data
    const enquiry = buildEnquiry(withoutPhone, 'test-id')
    expect(enquiry.phone).toBeNull()
  })

  it('includes a valid ISO 8601 createdAt timestamp', () => {
    const enquiry = buildEnquiry(data, 'test-id')
    expect(() => new Date(enquiry.createdAt)).not.toThrow()
    expect(new Date(enquiry.createdAt).toISOString()).toBe(enquiry.createdAt)
  })
})

// ─── isValidStatusTransition ──────────────────────────────────────────────────

describe('isValidStatusTransition', () => {
  const { NEW, CONTACTED, IN_PROGRESS, CONVERTED, CLOSED } = ENQUIRY_STATUSES

  it('allows new → contacted', () => {
    expect(isValidStatusTransition(NEW, CONTACTED)).toBe(true)
  })

  it('allows new → closed', () => {
    expect(isValidStatusTransition(NEW, CLOSED)).toBe(true)
  })

  it('allows contacted → in_progress', () => {
    expect(isValidStatusTransition(CONTACTED, IN_PROGRESS)).toBe(true)
  })

  it('allows contacted → closed', () => {
    expect(isValidStatusTransition(CONTACTED, CLOSED)).toBe(true)
  })

  it('allows in_progress → converted', () => {
    expect(isValidStatusTransition(IN_PROGRESS, CONVERTED)).toBe(true)
  })

  it('allows in_progress → closed', () => {
    expect(isValidStatusTransition(IN_PROGRESS, CLOSED)).toBe(true)
  })

  it('blocks new → converted (skipping steps)', () => {
    expect(isValidStatusTransition(NEW, CONVERTED)).toBe(false)
  })

  it('blocks new → in_progress (skipping steps)', () => {
    expect(isValidStatusTransition(NEW, IN_PROGRESS)).toBe(false)
  })

  it('blocks converted → closed (terminal state)', () => {
    expect(isValidStatusTransition(CONVERTED, CLOSED)).toBe(false)
  })

  it('blocks closed → any state (terminal state)', () => {
    expect(isValidStatusTransition(CLOSED, NEW)).toBe(false)
    expect(isValidStatusTransition(CLOSED, CONTACTED)).toBe(false)
    expect(isValidStatusTransition(CLOSED, IN_PROGRESS)).toBe(false)
  })

  it('returns false for an unknown currentStatus', () => {
    expect(isValidStatusTransition('ghost_status', NEW)).toBe(false)
  })
})

// ─── formatEnquiryForClient ───────────────────────────────────────────────────

describe('formatEnquiryForClient', () => {
  const fullEnquiry = {
    id: 'abc123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0412 345 678',
    service: 'welding-repairs',
    message: 'Fix my gate hinges.',
    status: 'contacted',
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-02T08:00:00.000Z',
    internalNote: 'Called twice, very keen.',
  }

  it('includes id, name, service, status, and submittedAt', () => {
    const output = formatEnquiryForClient(fullEnquiry)
    expect(output).toMatchObject({
      id: 'abc123',
      name: 'John Doe',
      service: 'welding-repairs',
      status: 'contacted',
      submittedAt: '2026-05-01T10:00:00.000Z',
    })
  })

  it('strips the email from the client-visible output', () => {
    const output = formatEnquiryForClient(fullEnquiry)
    expect(output.email).toBeUndefined()
  })

  it('strips the phone from the client-visible output', () => {
    const output = formatEnquiryForClient(fullEnquiry)
    expect(output.phone).toBeUndefined()
  })

  it('strips internal notes from the client-visible output', () => {
    const output = formatEnquiryForClient(fullEnquiry)
    expect(output.internalNote).toBeUndefined()
  })

  it('maps createdAt to submittedAt in the output', () => {
    const output = formatEnquiryForClient(fullEnquiry)
    expect(output.submittedAt).toBe(fullEnquiry.createdAt)
    expect(output.createdAt).toBeUndefined()
  })
})