import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, StatusBadge, Alert } from '../../components/ui'

export default function CustomerDashboard() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/projects').then(setProjects).catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <PageHeader title="My Projects" subtitle="Track the progress of your fabrication work." />
      {error && <Alert>{error}</Alert>}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <Link
                to={`/customer/projects/${project.id}`}
                className="text-lg font-semibold hover:text-amber-brand"
              >
                {project.title}
              </Link>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-steel-700 mt-2 text-sm">{project.description}</p>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-steel-700">No projects linked to your account yet.</p>
        )}
      </div>
    </div>
  )
}
