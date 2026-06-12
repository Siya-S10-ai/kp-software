import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

const ROLE_HOME = {
  super_admin: '/admin',
  operations_admin: '/admin',
  worker: '/worker',
  customer: '/customer',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('kp_token')
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('kp_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem('kp_token', token)
    setUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem('kp_token')
    setUser(null)
  }

  function homePath(role) {
    return ROLE_HOME[role] || '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, homePath }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
