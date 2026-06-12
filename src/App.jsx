import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PublicLayout, PortalLayout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import PortfolioPage from './pages/public/PortfolioPage'
import ReviewsPage from './pages/public/ReviewsPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/LoginPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminProjects from './pages/admin/AdminProjects'
import AdminProjectDetail from './pages/admin/AdminProjectDetail'
import AdminReviews from './pages/admin/AdminReviews'
import AdminCustomers from './pages/admin/AdminCustomers'

import WorkerDashboard from './pages/worker/WorkerDashboard'
import WorkerProjectDetail from './pages/worker/WorkerProjectDetail'

import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerProjectDetail from './pages/customer/CustomerProjectDetail'

const ADMIN_ROLES = ['super_admin', 'operations_admin']

const adminNav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/reviews', label: 'Reviews' },
]

export function AppRoutes() {
  return (
    <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={ADMIN_ROLES}>
                <PortalLayout title="Admin Dashboard" navItems={adminNav} />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:id" element={<AdminProjectDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

          <Route
            path="/worker"
            element={
              <ProtectedRoute roles={['worker']}>
                <PortalLayout title="Worker Portal" navItems={[{ to: '/worker', label: 'My Jobs' }]} />
              </ProtectedRoute>
            }
          >
            <Route index element={<WorkerDashboard />} />
            <Route path="projects/:id" element={<WorkerProjectDetail />} />
          </Route>

          <Route
            path="/customer"
            element={
              <ProtectedRoute roles={['customer']}>
                <PortalLayout title="Customer Portal" navItems={[{ to: '/customer', label: 'My Projects' }]} />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="projects/:id" element={<CustomerProjectDetail />} />
          </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
