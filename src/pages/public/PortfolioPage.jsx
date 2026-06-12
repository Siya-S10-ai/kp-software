import { useEffect, useState } from 'react'
import { publicApi } from '../../api/client'
import { PageHeader, Card, StatusBadge, Alert } from '../../components/ui'

export default function PortfolioPage() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    publicApi
      .getPortfolio()
      .then(setProjects)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left">
      <PageHeader
        title="Portfolio"
        subtitle="A selection of completed fabrication and welding projects."
      />
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-steel-700 mt-2">{project.description}</p>
              </div>
              <StatusBadge status="completed" />
            </div>
            <p className="text-sm text-steel-700 mt-3">
              Service: {project.service?.replace(/-/g, ' ')}
            </p>
          </Card>
        ))}
        {projects.length === 0 && !error && (
          <p className="text-steel-700">No portfolio projects published yet.</p>
        )}
      </div>
    </div>
  )
}
