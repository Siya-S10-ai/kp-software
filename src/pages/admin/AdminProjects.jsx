import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, StatusBadge, Alert } from '../../components/ui'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/projects').then(setProjects).catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <PageHeader title="Projects" subtitle="Track fabrication jobs and worker assignments." />
      {error && <Alert>{error}</Alert>}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <Link to={`/admin/projects/${project.id}`} className="text-lg font-semibold hover:text-amber-brand">
                  {project.title}
                </Link>
                <p className="text-sm text-steel-700 mt-1">{project.description}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-steel-700 mt-3">
              Workers assigned: {project.assignedWorkerIds?.length || 0}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
