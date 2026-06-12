import { useEffect, useState } from 'react'
import { publicApi } from '../../api/client'
import { PageHeader, Card, Alert } from '../../components/ui'

function Stars({ rating }) {
  return (
    <span className="text-amber-brand" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    publicApi
      .getReviews()
      .then(setReviews)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left">
      <PageHeader
        title="Customer Reviews"
        subtitle="Feedback from clients who have worked with KP Enterprise."
      />
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="font-semibold">{review.authorName}</h2>
              <Stars rating={review.rating} />
            </div>
            {review.title && <p className="font-medium mb-1">{review.title}</p>}
            <p className="text-steel-700">{review.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
