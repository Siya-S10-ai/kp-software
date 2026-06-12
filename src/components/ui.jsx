// ── Shared brand gradient ─────────────────────────────────────────────────────
const GRADIENT = 'linear-gradient(135deg, #00C4CC 0%, #0047FF 50%, #7D2AE8 100%)'
 
// ── PageHeader ────────────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: '#1a2332', letterSpacing: '-0.025em' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-steel-600 mt-1.5 text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
 
export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-steel-200 p-5 transition-shadow duration-200 hover:shadow-lg ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
    >
      {children}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
 
const BUTTON_VARIANTS = {
  primary: {
    style: { background: GRADIENT, color: '#fff', border: 'none' },
    hoverStyle: { opacity: 0.9 },
    base: 'shadow-sm hover:shadow-md',
  },
  secondary: {
    style: { background: '#2a3744', color: '#fff', border: 'none' },
    hoverStyle: {},
    base: 'hover:opacity-90',
  },
  outline: {
    style: { background: 'transparent', color: '#3d4f5f', border: '1.5px solid #b0bec9' },
    hoverStyle: { background: '#f4f6f8', borderColor: '#8a9aaa' },
    base: '',
  },
  danger: {
    style: { background: '#dc2626', color: '#fff', border: 'none' },
    hoverStyle: {},
    base: 'hover:opacity-90 shadow-sm',
  },
  ghost: {
    style: { background: 'transparent', color: '#3d4f5f', border: 'none' },
    hoverStyle: { background: '#f4f6f8' },
    base: '',
  },
}

export function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  const v = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary
 
  return (
    <button
      type="button"
      disabled={disabled}
      style={disabled ? { ...v.style, opacity: 0.5, cursor: 'not-allowed' } : v.style}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-xl text-sm font-semibold
        transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue
        ${v.base} ${className}
      `}
      onMouseEnter={(e) => {
        if (!disabled && v.hoverStyle) {
          Object.assign(e.currentTarget.style, v.hoverStyle)
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, v.style)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
 
// ── Badge ─────────────────────────────────────────────────────────────────────
 
const BADGE_TONES = {
  default: { bg: '#e8ecf0', color: '#3d4f5f' },
  success: { bg: '#dcfce7', color: '#15803d' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  danger:  { bg: '#fee2e2', color: '#b91c1c' },
  info:    { bg: '#dbeafe', color: '#1d4ed8' },
  purple:  { bg: '#ede9fe', color: '#6d28d9' },
}
 
export function Badge({ children, tone = 'default' }) {
  const { bg, color } = BADGE_TONES[tone] || BADGE_TONES.default
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  )
}
 
// ── StatusBadge ───────────────────────────────────────────────────────────────
 
const STATUS_TONE_MAP = {
  new:              'info',
  contacted:        'info',
  in_progress:      'warning',
  converted:        'success',
  closed:           'default',
  planning:         'info',
  completed:        'success',
  on_hold:          'warning',
  cancelled:        'danger',
  pending:          'warning',
  approved:         'success',
  rejected:         'danger',
  blocked:          'danger',
}
 
export function StatusBadge({ status }) {
  const tone = STATUS_TONE_MAP[status] || 'default'
  const label = status?.replace(/_/g, ' ') ?? '—'
  return <Badge tone={tone}>{label}</Badge>
}
 
// ── Alert ─────────────────────────────────────────────────────────────────────
 
const ALERT_STYLES = {
  error:   { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', icon: '✕' },
  success: { bg: '#f0fdf4', border: '#86efac', color: '#166534', icon: '✓' },
  info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1e40af', icon: 'ℹ' },
  warning: { bg: '#fffbeb', border: '#fcd34d', color: '#92400e', icon: '!' },
}
 
export function Alert({ type = 'error', children }) {
  const s = ALERT_STYLES[type] || ALERT_STYLES.error
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm mb-4 border"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{ background: s.border, color: s.color }}
        aria-hidden="true"
      >
        {s.icon}
      </span>
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
 
// ── StatCard — quick metric display ──────────────────────────────────────────
 
export function StatCard({ label, value, linkTo, linkLabel }) {
  return (
    <div
      className="bg-white rounded-2xl border border-steel-200 p-6"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
    >
      <p className="text-steel-500 text-sm font-medium">{label}</p>
      <p
        className="text-4xl font-extrabold mt-1 mb-4 tracking-tight"
        style={{
          background: GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </p>
      {linkTo && (
        <a
          href={linkTo}
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#0047FF' }}
        >
          {linkLabel} →
        </a>
      )}
    </div>
  )
}
 
// ── EmptyState ────────────────────────────────────────────────────────────────
 
export function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="text-center py-16 text-steel-400">
      <div
        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,196,204,0.12), rgba(125,42,232,0.12))' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-steel-400">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><dot cx="12" cy="16" r="1"/>
        </svg>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}
 
// ── SectionHeading ─────────────────────────────────────────────────────────────
 
export function SectionHeading({ children }) {
  return (
    <h2 className="text-xl font-bold text-steel-900 mb-4 tracking-tight">
      {children}
    </h2>
  )
}
