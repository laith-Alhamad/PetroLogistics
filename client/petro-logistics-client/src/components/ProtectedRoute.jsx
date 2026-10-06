import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

function ProtectedRoute({ children, roles }) {
  const isAuthenticated =
    authService.isAuthenticated()

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Logged in but does not have permission
  if (roles && roles.length > 0) {
    const userRole = authService.getRole()

    if (!roles.includes(userRole)) {
      return (
        
        <Navigate  to="/access-denied" replace />
        
      )
    }
  }

  return children
}

export default ProtectedRoute