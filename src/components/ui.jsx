export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-steel-900">{title}</h1>
      {subtitle && <p className="text-steel-700 mt-2">{subtitle}</p>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-steel-200 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-amber-brand hover:bg-amber-brand-dark text-white',
    secondary: 'bg-steel-700 hover:bg-steel-800 text-white',
    outline: 'border border-steel-300 text-steel-800 hover:bg-steel-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-steel-100 text-steel-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    new: 'info',
    contacted: 'info',
    in_progress: 'warning',
    converted: 'success',
    closed: 'default',
    planning: 'info',
    completed: 'success',
    on_hold: 'warning',
    cancelled: 'danger',
    pending: 'default',
    approved: 'success',
    rejected: 'danger',
    blocked: 'danger',
  }
  return <Badge tone={map[status] || 'default'}>{status?.replace(/_/g, ' ')}</Badge>
}

export function Alert({ type = 'error', children }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  return (
    <div className={`border rounded-md px-4 py-3 text-sm mb-4 ${styles[type]}`}>
      {children}
    </div>
  )
}
