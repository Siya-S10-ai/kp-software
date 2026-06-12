import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { PageHeader, Card, Button, StatusBadge, Alert } from '../../components/ui'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setReviews(await api.get('/reviews?status=pending'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  async function moderate(id, status) {
    try {
      await api.patch(`/reviews/${id}/moderate`, { status })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Review Moderation" subtitle="Approve or reject customer feedback." />
      {error && <Alert>{error}</Alert>}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex justify-between gap-3 mb-2">
              <h2 className="font-semibold">{review.authorName} — {review.rating}/5</h2>
              <StatusBadge status={review.status} />
            </div>
            {review.title && <p className="font-medium">{review.title}</p>}
            <p className="text-steel-700 my-3">{review.body}</p>
            <div className="flex gap-2">
              <Button onClick={() => moderate(review.id, 'approved')}>Approve</Button>
              <Button variant="danger" onClick={() => moderate(review.id, 'rejected')}>Reject</Button>
            </div>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-steel-700">No reviews awaiting moderation.</p>}
      </div>
    </div>
  )
}
