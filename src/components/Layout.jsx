import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GRADIENT = 'linear-gradient(135deg, #00C4CC 0%, #0047FF 50%, #7D2AE8 100%)'

// SHARED ICONS

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

// PUBLIC NAV LINK

function PublicNavLink({ to, children, onClick, mobile = false }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        mobile
          ? `block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/85 hover:bg-white/15 hover:text-white'
            }`
          : `px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/85 hover:bg-white/15 hover:text-white'
            }`
      }
    >
      {children}
    </NavLink>
  )
}

// PORTAL NAV LINK

function PortalNavLink({ to, children, onClick, mobile = false }) {
  return (
    <NavLink
      to={to}
      end={to.split('/').length <= 2}
      onClick={onClick}
      className={({ isActive }) =>
        mobile
          ? `block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              isActive
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/85 hover:bg-white/15 hover:text-white'
            }`
          : `px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-white/25 text-white font-semibold'
                : 'text-white/80 hover:bg-white/15 hover:text-white'
            }`
      }
    >
      {children}
    </NavLink>
  )
}

// function NavItem({ to, children }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//           isActive
//             ? 'bg-amber-brand text-white'
//             : 'text-steel-700 hover:bg-steel-100'
//         }`
//       }
//     >
//       {children}
//     </NavLink>
//   )
// }

// ── Public Layout ─────────────────────────────────────────────────────────────
 
export function PublicLayout() {
  const { user, logout, homePath } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
 
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])
 
  const publicLinks = [
    { to: '/',          label: 'Home' },
    { to: '/services',  label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/reviews',   label: 'Reviews' },
    { to: '/contact',   label: 'Contact' },
  ]
 
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Sticky gradient nav ── */}
      <header
        className="sticky top-0 z-50"
        style={{ background: GRADIENT, boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
            >
              KP{' '}
              <span
                className="font-extrabold"
                style={{ color: '#FFE066', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
              >
                Enterprise
              </span>
            </Link>
 
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {publicLinks.map((link) => (
                <PublicNavLink key={link.to} to={link.to}>
                  {link.label}
                </PublicNavLink>
              ))}
              <div className="w-px h-5 bg-white/25 mx-1" aria-hidden="true" />
              {user ? (
                <>
                  <PublicNavLink to={homePath(user.role)}>
                    Portal
                  </PublicNavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-3.5 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                >
                  Log in
                </Link>
              )}
            </nav>
 
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
 
        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden mobile-menu-enter border-t border-white/15"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)' }}
          >
            <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {publicLinks.map((link) => (
                <PublicNavLink key={link.to} to={link.to} mobile>
                  {link.label}
                </PublicNavLink>
              ))}
              <div className="h-px bg-white/20 my-1" />
              {user ? (
                <>
                  <PublicNavLink to={homePath(user.role)} mobile>
                    Portal
                  </PublicNavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-3 text-sm font-semibold text-white text-center rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  Log in
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
 
      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
 
      {/* Footer */}
      <footer
        className="text-center py-8 px-4"
        style={{ background: GRADIENT }}
      >
        <p className="text-white/70 text-sm">
          © {new Date().getFullYear()}{' '}
          <span className="text-white font-semibold">KP Enterprise</span>
          {' '}— Welding & Fabrication
        </p>
      </footer>
    </div>
  )
}
 
// ── Portal Layout ─────────────────────────────────────────────────────────────
 
export function PortalLayout({ title, navItems }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
 
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])
 
  const roleLabel = user?.role?.replace(/_/g, ' ')
 
  // Role badge colours
  const roleBadgeStyle = {
    super_admin:       { bg: '#FFE066', color: '#1a2332' },
    operations_admin:  { bg: '#00C4CC', color: '#fff' },
    worker:            { bg: '#7D2AE8', color: '#fff' },
    customer:          { bg: '#0047FF', color: '#fff' },
  }[user?.role] || { bg: 'rgba(255,255,255,0.2)', color: '#fff' }
 
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f2f5' }}>
      {/* ── Sticky portal header ── */}
      <header
        className="sticky top-0 z-50"
        style={{ background: GRADIENT, boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
      >
        {/* Top row */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand + portal title */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
              >
                KP{' '}
                <span style={{ color: '#FFE066', fontWeight: 800 }}>Enterprise</span>
              </Link>
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                {title}
              </div>
            </div>
 
            {/* Desktop user info + controls */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium text-white/90"
                  >
                    {user.name}
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs font-semibold rounded-full capitalize"
                    style={{ background: roleBadgeStyle.bg, color: roleBadgeStyle.color }}
                  >
                    {roleLabel}
                  </span>
                </div>
              )}
              <div className="w-px h-4 bg-white/25" aria-hidden="true" />
              <Link
                to="/"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Public site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                Log out
              </button>
            </div>
 
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
 
        {/* Desktop portal sub-nav */}
        {navItems?.length > 0 && (
          <nav
            className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 pb-2.5 gap-1"
            aria-label="Portal navigation"
          >
            {navItems.map((item) => (
              <PortalNavLink key={item.to} to={item.to}>
                {item.label}
              </PortalNavLink>
            ))}
          </nav>
        )}
 
        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden mobile-menu-enter border-t border-white/15"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)' }}
          >
            <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Mobile portal navigation">
              {navItems?.map((item) => (
                <PortalNavLink key={item.to} to={item.to} mobile>
                  {item.label}
                </PortalNavLink>
              ))}
              <div className="h-px bg-white/20 my-1" />
              {user && (
                <div className="px-4 py-2 flex items-center gap-2">
                  <span className="text-sm text-white/80">{user.name}</span>
                  <span
                    className="px-2 py-0.5 text-xs font-semibold rounded-full capitalize"
                    style={{ background: roleBadgeStyle.bg, color: roleBadgeStyle.color }}
                  >
                    {roleLabel}
                  </span>
                </div>
              )}
              <Link
                to="/"
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all"
              >
                Public site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all"
              >
                Log out
              </button>
            </nav>
          </div>
        )}
      </header>
 
      {/* Portal content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
