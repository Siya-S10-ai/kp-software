import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { PageHeader, Card, Button, StatusBadge, Alert } from '../../components/ui'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    try {
      setEnquiries(await api.get('/enquiries'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    setMessage('')
    try {
      await api.patch(`/enquiries/${id}`, { status })
      setMessage(`Enquiry marked as ${status}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function convert(id) {
    setMessage('')
    try {
      const result = await api.post(`/enquiries/${id}/convert`, {})
      setMessage(`Converted to project: ${result.project.title}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Enquiry Management" subtitle="Review and convert incoming leads." />
      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <Card key={enquiry.id}>
            <div className="flex flex-wrap justify-between gap-3 mb-2">
              <div>
                <h2 className="font-semibold text-lg">{enquiry.name}</h2>
                <p className="text-sm text-steel-700">{enquiry.email} · {enquiry.service}</p>
              </div>
              <StatusBadge status={enquiry.status} />
            </div>
            <p className="text-steel-700 mb-4">{enquiry.message}</p>
            <div className="flex flex-wrap gap-2">
              {enquiry.status === 'new' && (
                <Button onClick={() => updateStatus(enquiry.id, 'contacted')}>Mark contacted</Button>
              )}
              {enquiry.status === 'contacted' && (
                <Button onClick={() => updateStatus(enquiry.id, 'in_progress')}>In progress</Button>
              )}
              {enquiry.status === 'in_progress' && (
                <Button onClick={() => convert(enquiry.id)}>Convert to project</Button>
              )}
              {enquiry.status !== 'closed' && enquiry.status !== 'converted' && (
                <Button variant="outline" onClick={() => updateStatus(enquiry.id, 'closed')}>Close</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
