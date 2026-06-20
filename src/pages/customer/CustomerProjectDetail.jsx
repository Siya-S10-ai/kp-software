import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { PageHeader, Card, Button, StatusBadge, Alert } from '../../components/ui'
import ProjectCommunication from '../../components/ProjectCommunication'

export default function CustomerProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [updates, setUpdates] = useState([])
  const [media, setMedia] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const [proj, updateList, mediaList] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/progress-updates?projectId=${id}`),
      api.get(`/media?projectId=${id}`),
    ])
    setProject(proj)
    setUpdates(updateList)
    setMedia(mediaList)
  }

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [id])

  async function submitReview(e) {
    e.preventDefault()
    try {
      await api.post('/reviews', { ...reviewForm, projectId: id, rating: Number(reviewForm.rating) })
      setMessage('Review submitted for moderation')
      setReviewForm({ rating: 5, title: '', body: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  if (!project) return <p>Loading...</p>

  return (
    <div>
      <PageHeader title={project.title} subtitle="Project timeline and updates." />
      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <Card className="mb-6">
        <div className="flex justify-between gap-3 mb-3">
          <h2 className="font-semibold">Status</h2>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-steel-700">{project.description}</p>
      </Card>

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
        <h2 className="font-semibold mb-3">Progress updates</h2>
        {updates.length === 0 ? (
          <p className="text-steel-700 text-sm">No customer-visible updates yet.</p>
        ) : (
          <ul className="space-y-3">
            {updates.map((u) => (
              <li key={u.id} className="border-b border-steel-100 pb-2">
                <p className="text-sm text-steel-700">{new Date(u.createdAt).toLocaleDateString()}</p>
                <p>{u.note}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ProjectCommunication projectId={id} />

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Photos & media</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((file) => (
            <div key={file.id} className="border border-steel-200 rounded-md overflow-hidden">
              <img src={file.dataUrl} alt={file.caption || file.fileName} className="w-full h-32 object-cover" />
              {file.caption && <p className="text-xs p-2 text-steel-700">{file.caption}</p>}
            </div>
          ))}
        </div>
        {media.length === 0 && <p className="text-steel-700 text-sm">No media shared yet.</p>}
      </Card>

      {project.status === 'completed' && (
        <Card>
          <h2 className="font-semibold mb-3">Leave a review</h2>
          <form onSubmit={submitReview} className="space-y-3">
            <select
              className="border border-steel-300 rounded-md px-3 py-2"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
            <input
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              placeholder="Review title (optional)"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
            />
            <textarea
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              rows={4}
              required
              placeholder="Share your experience..."
              value={reviewForm.body}
              onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
            />
            <Button type="submit">Submit review</Button>
          </form>
        </Card>
      )}
    </div>
  )
}
