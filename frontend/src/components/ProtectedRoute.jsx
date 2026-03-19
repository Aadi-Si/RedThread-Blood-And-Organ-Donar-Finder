import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" />
  }

  // Wrong role → redirect to correct dashboard
  if (allowedRole && role !== allowedRole) {
    if (role === 'donor') return <Navigate to="/donor/dashboard" />
    if (role === 'hospital') return <Navigate to="/hospital/dashboard" />
  }

  return children
}

export default ProtectedRoute