import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, Button, StatusBadge, Alert } from '../../components/ui'
import ProjectCommunication from '../../components/ProjectCommunication'

export default function WorkerProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [note, setNote] = useState('')
  const [visibleToCustomer, setVisibleToCustomer] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const [proj, taskList] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/tasks?projectId=${id}`),
    ])
    setProject(proj)
    setTasks(taskList)
  }

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [id])

  async function updateTaskStatus(taskId, status) {
    try {
      await api.patch(`/tasks/${taskId}`, { status })
      setMessage(`Task updated to ${status}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitNote(e) {
    e.preventDefault()
    try {
      await api.post('/progress-updates', {
        projectId: id,
        note,
        visibleToCustomer,
      })
      setNote('')
      setMessage('Progress note submitted')
    } catch (err) {
      setError(err.message)
    }
  }

  async function uploadPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await api.post('/media', {
          projectId: id,
          fileName: file.name,
          mimeType: file.type,
          dataUrl: reader.result,
          caption: 'Progress photo',
          visibleToCustomer,
        })
        setMessage('Photo uploaded')
      } catch (err) {
        setError(err.message)
      }
    }
    reader.readAsDataURL(file)
  }

  if (!project) return <p>Loading...</p>

  return (
    <div>
      <PageHeader title={project.title} subtitle="Update tasks and submit progress." />
      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <Card className="mb-6">
        <StatusBadge status={project.status} />
        <p className="text-steel-700 mt-3">{project.description}</p>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-wrap justify-between items-center gap-3 border-b border-steel-100 pb-3">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-steel-700">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={task.status} />
                {task.status !== 'completed' && (
                  <>
                    <Button variant="outline" onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                      Start
                    </Button>
                    <Button onClick={() => updateTaskStatus(task.id, 'completed')}>
                      Complete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Progress note</h2>
        <form onSubmit={submitNote} className="space-y-3">
          <textarea
            className="w-full border border-steel-300 rounded-md px-3 py-2"
            rows={3}
            required
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe work completed..."
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={visibleToCustomer}
              onChange={(e) => setVisibleToCustomer(e.target.checked)}
            />
            Visible to customer
          </label>
          <Button type="submit">Submit note</Button>
        </form>
      </Card>

      <ProjectCommunication projectId={id} />

      <Card>
        <h2 className="font-semibold mb-3">Upload progress photo</h2>
        <input type="file" accept="image/*" onChange={uploadPhoto} />
      </Card>
    </div>
  )
}
