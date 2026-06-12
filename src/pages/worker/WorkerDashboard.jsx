import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, StatusBadge, Alert } from '../../components/ui'

export default function WorkerDashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/tasks')])
      .then(([projectList, taskList]) => {
        setProjects(projectList)
        setTasks(taskList)
      })
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <PageHeader title="My Jobs" subtitle="Projects and tasks assigned to you." />
      {error && <Alert>{error}</Alert>}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <p className="text-sm text-steel-700">Assigned projects</p>
          <p className="text-3xl font-bold">{projects.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-steel-700">Open tasks</p>
          <p className="text-3xl font-bold">
            {tasks.filter((t) => t.status !== 'completed').length}
          </p>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Assigned projects</h2>
      <div className="space-y-4 mb-8">
        {projects.map((project) => (
          <Card key={project.id}>
            <Link to={`/worker/projects/${project.id}`} className="font-semibold hover:text-amber-brand">
              {project.title}
            </Link>
            <div className="mt-2"><StatusBadge status={project.status} /></div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">My tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <div className="flex justify-between gap-3">
              <span>{task.title}</span>
              <StatusBadge status={task.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
