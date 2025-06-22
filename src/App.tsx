import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import TripsPage from '@/pages/TripsPage'
import ReservationsPage from '@/pages/ReservationsPage'
import ReviewsPage from '@/pages/ReviewsPage'
import AdminsPage from '@/pages/AdminsPage'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="admins" element={<AdminsPage />} />
      </Route>
    </Routes>
  )
}

export default App 