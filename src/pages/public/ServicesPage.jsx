import { useEffect, useState } from 'react'
import { publicApi } from '../../api/client'
import { PageHeader, Card, Alert } from '../../components/ui'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    publicApi
      .getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left">
      <PageHeader
        title="Our Services"
        subtitle="Professional welding and fabrication for every scale of project."
      />
      {error && <Alert>{error}</Alert>}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-steel-700">{service.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
