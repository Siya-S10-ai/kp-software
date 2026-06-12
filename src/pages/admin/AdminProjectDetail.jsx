import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, Button, StatusBadge, Alert } from '../../components/ui'

export default function AdminProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [workers, setWorkers] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedWorkers, setSelectedWorkers] = useState([])
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedWorkerId: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const [proj, workerList, taskList] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get('/workers'),
      api.get(`/tasks?projectId=${id}`),
    ])
    setProject(proj)
    setWorkers(workerList)
    setTasks(taskList)
    setSelectedWorkers(proj.assignedWorkerIds || [])
  }

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [id])

  async function assignWorkers() {
    try {
      await api.post(`/projects/${id}/assign-workers`, { workerIds: selectedWorkers })
      setMessage('Workers assigned')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function createTask(e) {
    e.preventDefault()
    try {
      await api.post('/tasks', { ...taskForm, projectId: id })
      setTaskForm({ title: '', description: '', assignedWorkerId: '' })
      setMessage('Task created')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateProjectStatus(status) {
    try {
      await api.patch(`/projects/${id}`, { status })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!project) return <p>Loading project...</p>

  return (
    <div>
      <PageHeader title={project.title} subtitle={project.description} />
      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="font-semibold mb-3">Project status</h2>
          <StatusBadge status={project.status} />
          <div className="flex flex-wrap gap-2 mt-4">
            {['planning', 'in_progress', 'on_hold', 'completed'].map((status) => (
              <Button key={status} variant="outline" onClick={() => updateProjectStatus(status)}>
                Set {status.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-3">Assign workers</h2>
          <div className="space-y-2">
            {workers.map((worker) => (
              <label key={worker.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedWorkers.includes(worker.id)}
                  onChange={(e) => {
                    setSelectedWorkers((prev) =>
                      e.target.checked
                        ? [...prev, worker.id]
                        : prev.filter((w) => w !== worker.id)
                    )
                  }}
                />
                {worker.name}
              </label>
            ))}
          </div>
          <Button className="mt-3" onClick={assignWorkers}>Save assignments</Button>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Milestones</h2>
        <ul className="space-y-2">
          {project.milestones?.map((m) => (
            <li key={m.id} className="flex justify-between text-sm border-b border-steel-100 pb-2">
              <span>{m.title}</span>
              <StatusBadge status={m.status} />
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Create task</h2>
        <form onSubmit={createTask} className="grid md:grid-cols-2 gap-3">
          <input
            className="border border-steel-300 rounded-md px-3 py-2"
            placeholder="Task title"
            required
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
          <select
            className="border border-steel-300 rounded-md px-3 py-2"
            value={taskForm.assignedWorkerId}
            onChange={(e) => setTaskForm({ ...taskForm, assignedWorkerId: e.target.value })}
          >
            <option value="">Assign worker (optional)</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <textarea
            className="border border-steel-300 rounded-md px-3 py-2 md:col-span-2"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <Button type="submit">Add task</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Tasks</h2>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center border-b border-steel-100 pb-2">
              <span>{task.title}</span>
              <StatusBadge status={task.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
