import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Card, Button, Alert } from '../components/ui'

const DEMO_ACCOUNTS = [
  { email: 'admin@kp.com', role: 'Super Admin' },
  { email: 'ops@kp.com', role: 'Operations Admin' },
  { email: 'worker@kp.com', role: 'Worker' },
  { email: 'customer@kp.com', role: 'Customer' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const { login, homePath } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      navigate(homePath(user.role))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left">
      <PageHeader title="Portal Login" subtitle="Access your KP Enterprise account." />
      {error && <Alert>{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full border border-steel-300 rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </Card>
      <Card className="mt-6">
        <p className="text-sm text-steel-700 mb-3">Demo accounts (password: <code>password123</code>):</p>
        <ul className="text-sm space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className="text-amber-brand hover:underline"
                onClick={() => setEmail(account.email)}
              >
                {account.email}
              </button>
              <span className="text-steel-700"> — {account.role}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
