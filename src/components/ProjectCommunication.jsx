import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Alert } from './ui'

function buildThread(messages) {
  const byId = new Map(messages.map((m) => [m.id, { ...m, replies: [] }]))
  const roots = []

  for (const message of messages) {
    const node = byId.get(message.id)
    if (message.parentMessageId && byId.has(message.parentMessageId)) {
      byId.get(message.parentMessageId).replies.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortByDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  roots.sort(sortByDate)
  for (const node of byId.values()) {
    node.replies.sort(sortByDate)
  }

  return roots
}

function MessageItem({
  message,
  messagesById,
  replyingTo,
  replyText,
  editingId,
  editText,
  canReply,
  canEdit,
  onReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  onEdit,
  onCancelEdit,
  onEditTextChange,
  onSubmitEdit,
}) {
  const isReplyFormOpen = replyingTo === message.id
  const isEditing = editingId === message.id
  const parent = message.parentMessageId ? messagesById.get(message.parentMessageId) : null

  return (
    <li className={message.parentMessageId ? 'ml-4 md:ml-6 border-l-2 border-brand-blue/30 pl-4' : ''}>
      <div className="border border-steel-100 rounded-lg p-3 bg-steel-50/50">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">{message.authorName}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                message.authorRole === 'worker'
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'bg-steel-200 text-steel-700'
              }`}
            >
              {message.authorRole === 'worker' ? 'Worker' : 'Customer'}
            </span>
          </div>
          <time className="text-xs text-steel-500">
            {new Date(message.createdAt).toLocaleString()}
          </time>
        </div>

        {parent && (
          <p className="text-xs text-steel-500 mb-2 border-l-2 border-steel-300 pl-2">
            Replying to {parent.authorName}: &ldquo;{parent.text.length > 80 ? `${parent.text.slice(0, 80)}…` : parent.text}&rdquo;
          </p>
        )}

        {isEditing ? (
          <form onSubmit={(e) => onSubmitEdit(e, message.id)} className="mt-3 space-y-2">
            <textarea
              className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm"
              rows={2}
              required
              autoFocus
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" className="!py-1.5 !px-3 text-xs">
                Save
              </Button>
              <Button type="button" variant="outline" className="!py-1.5 !px-3 text-xs" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-steel-800 text-sm whitespace-pre-wrap">{message.text}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {canReply(message) && !isReplyFormOpen && (
                <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => onReply(message.id)}>
                  Reply
                </Button>
              )}
              {canEdit(message) && (
                <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => onEdit(message)}>
                  Edit
                </Button>
              )}
            </div>
          </>
        )}

        {!isEditing && isReplyFormOpen && (
          <form onSubmit={(e) => onSubmitReply(e, message.id)} className="mt-3 space-y-2">
            <textarea
              className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm"
              rows={2}
              required
              autoFocus
              placeholder={`Reply to ${message.authorName}...`}
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" className="!py-1.5 !px-3 text-xs">
                Send reply
              </Button>
              <Button type="button" variant="outline" className="!py-1.5 !px-3 text-xs" onClick={onCancelReply}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {message.replies?.length > 0 && (
        <ul className="mt-3 space-y-3">
          {message.replies.map((reply) => (
            <MessageItem
              key={reply.id}
              message={reply}
              messagesById={messagesById}
              replyingTo={replyingTo}
              replyText={replyText}
              editingId={editingId}
              editText={editText}
              canReply={canReply}
              canEdit={canEdit}
              onReply={onReply}
              onCancelReply={onCancelReply}
              onReplyTextChange={onReplyTextChange}
              onSubmitReply={onSubmitReply}
              onEdit={onEdit}
              onCancelEdit={onCancelEdit}
              onEditTextChange={onEditTextChange}
              onSubmitEdit={onSubmitEdit}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function ProjectCommunication({ projectId }) {
  const { user } = useAuth()
  const myRole = user?.role === 'customer' ? 'customer' : 'worker'
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadMessages() {
    const list = await api.get(`/messages?projectId=${projectId}`)
    setMessages(list)
  }

  useEffect(() => {
    let isCurrent = true

    api
      .get(`/messages?projectId=${projectId}`)
      .then((list) => {
        if (isCurrent) setMessages(list)
      })
      .catch((err) => {
        if (isCurrent) setError(err.message)
      })

    return () => {
      isCurrent = false
    }
  }, [projectId])

  async function submitMessage(e, parentMessageId = null) {
    e.preventDefault()
    const text = parentMessageId ? replyText : newMessage
    if (!text.trim()) return

    try {
      await api.post('/messages', {
        projectId,
        text: text.trim(),
        parentMessageId: parentMessageId || null,
      })
      if (parentMessageId) {
        setReplyText('')
        setReplyingTo(null)
      } else {
        setNewMessage('')
      }
      setSuccess(parentMessageId ? 'Reply sent' : 'Message sent')
      setError('')
      await loadMessages()
    } catch (err) {
      setError(err.message)
      setSuccess('')
    }
  }

  function canReply(message) {
    return message.authorRole !== myRole
  }

  function canEdit(message) {
    return message.authorId === user?.id
  }

  function startEditing(message) {
    setEditingId(message.id)
    setEditText(message.text)
    setReplyingTo(null)
    setReplyText('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditText('')
  }

  async function submitEdit(e, id) {
    e.preventDefault()
    if (!editText.trim()) return

    try {
      await api.patch(`/messages/${id}`, { text: editText.trim() })
      setEditingId(null)
      setEditText('')
      setSuccess('Message updated')
      setError('')
      await loadMessages()
    } catch (err) {
      setError(err.message)
      setSuccess('')
    }
  }

  const messagesById = new Map(messages.map((m) => [m.id, m]))
  const thread = buildThread(messages)

  return (
    <Card className="mb-6">
      <h2 className="font-semibold mb-3">Communication</h2>
      <p className="text-sm text-steel-600 mb-4">
        Exchange feedback and replies with your project team throughout the job.
      </p>

      {error && <Alert>{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {thread.length === 0 ? (
        <p className="text-steel-700 text-sm mb-4">No messages yet. Start the conversation below.</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {thread.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              messagesById={messagesById}
              replyingTo={replyingTo}
              replyText={replyText}
              editingId={editingId}
              editText={editText}
              canReply={canReply}
              canEdit={canEdit}
              onReply={setReplyingTo}
              onCancelReply={() => {
                setReplyingTo(null)
                setReplyText('')
              }}
              onReplyTextChange={setReplyText}
              onSubmitReply={submitMessage}
              onEdit={startEditing}
              onCancelEdit={cancelEditing}
              onEditTextChange={setEditText}
              onSubmitEdit={submitEdit}
            />
          ))}
        </ul>
      )}

      <form onSubmit={(e) => submitMessage(e)} className="space-y-3 border-t border-steel-100 pt-4">
        <h3 className="text-sm font-medium text-steel-800">New message / feedback</h3>
        <textarea
          className="w-full border border-steel-300 rounded-md px-3 py-2"
          rows={3}
          required
          placeholder="Share feedback or ask a question..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send message</Button>
      </form>
    </Card>
  )
}
