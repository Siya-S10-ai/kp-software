import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { PageHeader, Card, Alert } from '../../components/ui'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/customers').then(setCustomers).catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <PageHeader title="Customers" subtitle="Customer records linked to projects and reviews." />
      {error && <Alert>{error}</Alert>}
      <div className="grid md:grid-cols-2 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <h2 className="font-semibold">{customer.name}</h2>
            <p className="text-sm text-steel-700 mt-1">{customer.email}</p>
            {customer.phone && <p className="text-sm text-steel-700">{customer.phone}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}
