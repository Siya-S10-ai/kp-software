import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, Alert } from '../../components/ui'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ enquiries: 0, projects: 0, reviews: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/enquiries'),
      api.get('/projects'),
      api.get('/reviews?status=pending'),
    ])
      .then(([enquiries, projects, reviews]) => {
        setStats({
          enquiries: enquiries.length,
          projects: projects.length,
          reviews: reviews.length,
        })
      })
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <PageHeader title="Operations Dashboard" subtitle="Manage leads, projects, and reviews." />
      {error && <Alert>{error}</Alert>}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-steel-700">Open enquiries</p>
          <p className="text-3xl font-bold mt-2">{stats.enquiries}</p>
          <Link to="/admin/enquiries" className="text-amber-brand text-sm mt-3 inline-block hover:underline">
            Manage enquiries →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-steel-700">Active projects</p>
          <p className="text-3xl font-bold mt-2">{stats.projects}</p>
          <Link to="/admin/projects" className="text-amber-brand text-sm mt-3 inline-block hover:underline">
            View projects →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-steel-700">Reviews pending moderation</p>
          <p className="text-3xl font-bold mt-2">{stats.reviews}</p>
          <Link to="/admin/reviews" className="text-amber-brand text-sm mt-3 inline-block hover:underline">
            Moderate reviews →
          </Link>
        </Card>
      </div>
    </div>
  )
}
