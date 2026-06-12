import { useState } from 'react'
import { publicApi } from '../../api/client'
import { PageHeader, Card, Button, Alert } from '../../components/ui'

const SERVICE_OPTIONS = [
  'custom-fabrication',
  'structural-steel',
  'welding-repairs',
  'handrails-balustrades',
  'gates-fencing',
  'other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'custom-fabrication',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSubmitting(true)
    try {
      await publicApi.submitEnquiry(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', service: 'custom-fabrication', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-left">
      <PageHeader
        title="Contact & Quote Request"
        subtitle="Tell us about your project and we will get back to you."
      />
      {error && <Alert>{error}</Alert>}
      {success && (
        <Alert type="success">
          Thank you! Your enquiry has been submitted. Our team will be in touch soon.
        </Alert>
      )}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              required
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="service">Service</label>
            <select
              id="service"
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={form.service}
              onChange={(e) => updateField('service', e.target.value)}
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">Project details</label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit enquiry'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
