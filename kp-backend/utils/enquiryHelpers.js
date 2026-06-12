/**
 * enquiryHelpers.js
 * Pure business logic helpers for the enquiry/lead domain.
 * Shared with frontend tests via src/utils/enquiryHelpers.js (keep in sync).
 */

const VALID_SERVICES = [
  'custom-fabrication',
  'structural-steel',
  'welding-repairs',
  'handrails-balustrades',
  'gates-fencing',
  'other',
]

const ENQUIRY_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  IN_PROGRESS: 'in_progress',
  CONVERTED: 'converted',
  CLOSED: 'closed',
}

function validateEnquiry(data) {
  const errors = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Payload must be an object'] }
  }

  const { name, email, service, message, phone } = data

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required')
  } else if (name.trim().length < 2) {
    errors.push('name must be at least 2 characters')
  } else if (name.trim().length > 100) {
    errors.push('name must be 100 characters or fewer')
  }

  if (!email || typeof email !== 'string') {
    errors.push('email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be a valid email address')
  }

  if (!service) {
    errors.push('service is required')
  } else if (!VALID_SERVICES.includes(service)) {
    errors.push(`service must be one of: ${VALID_SERVICES.join(', ')}`)
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push('message is required')
  } else if (message.trim().length < 10) {
    errors.push('message must be at least 10 characters')
  } else if (message.trim().length > 2000) {
    errors.push('message must be 2000 characters or fewer')
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string') {
      errors.push('phone must be a string')
    } else if (phone.replace(/[\s\-().+]/g, '').length < 10) {
      errors.push('phone number appears too short')
    }
  }

  return { valid: errors.length === 0, errors }
}

function buildEnquiry(data, idOverride) {
  return {
    id: idOverride || Date.now().toString(),
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone ? data.phone.trim() : null,
    service: data.service,
    message: data.message.trim(),
    status: ENQUIRY_STATUSES.NEW,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function isValidStatusTransition(currentStatus, newStatus) {
  const allowed = {
    [ENQUIRY_STATUSES.NEW]: [ENQUIRY_STATUSES.CONTACTED, ENQUIRY_STATUSES.CLOSED],
    [ENQUIRY_STATUSES.CONTACTED]: [ENQUIRY_STATUSES.IN_PROGRESS, ENQUIRY_STATUSES.CLOSED],
    [ENQUIRY_STATUSES.IN_PROGRESS]: [ENQUIRY_STATUSES.CONVERTED, ENQUIRY_STATUSES.CLOSED],
    [ENQUIRY_STATUSES.CONVERTED]: [],
    [ENQUIRY_STATUSES.CLOSED]: [],
  }

  return (allowed[currentStatus] || []).includes(newStatus)
}

function formatEnquiryForClient(enquiry) {
  const { id, name, service, status, createdAt } = enquiry
  return { id, name, service, status, submittedAt: createdAt }
}

module.exports = {
  validateEnquiry,
  buildEnquiry,
  isValidStatusTransition,
  formatEnquiryForClient,
  VALID_SERVICES,
  ENQUIRY_STATUSES,
}
