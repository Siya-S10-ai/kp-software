import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-amber-brand text-white'
            : 'text-steel-700 hover:bg-steel-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function PublicLayout() {
  const { user, logout, homePath } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-steel-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            KP <span className="text-amber-brand">Enterprise</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/reviews">Reviews</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            {user ? (
              <>
                <NavItem to={homePath(user.role)}>Portal</NavItem>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-2 text-sm text-steel-200 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavItem to="/login">Login</NavItem>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-steel-800 text-steel-200 text-sm py-6 text-center">
        © {new Date().getFullYear()} KP Enterprise — Welding & Fabrication
      </footer>
    </div>
  )
}

export function PortalLayout({ title, navItems }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-steel-50">
      <header className="bg-steel-900 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-lg font-bold">
              KP <span className="text-amber-brand">Enterprise</span>
            </Link>
            <p className="text-steel-200 text-sm">{title}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-steel-200">
              {user?.name} ({user?.role?.replace('_', ' ')})
            </span>
            <Link to="/" className="text-sm text-amber-brand hover:underline">
              Public site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm px-3 py-1 rounded bg-steel-700 hover:bg-steel-600"
            >
              Logout
            </button>
          </div>
        </div>
        {navItems?.length > 0 && (
          <nav className="max-w-6xl mx-auto px-4 pb-3 flex gap-2">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
