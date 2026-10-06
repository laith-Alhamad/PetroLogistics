import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { authService } from '../services/authService'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated =
    authService.isAuthenticated()

  const role = authService.getRole()
  const email = authService.getEmail()

  // Do not show Navbar on Login page
  if (
    location.pathname === '/login' ||
    !isAuthenticated
  ) {
    return null
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <NavLink
          className="navbar-brand fw-bold"
          to="/"
        >
          PetroLogistics
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav me-auto">

            {/* Admin + Operator */}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
              >
                Dashboard
              </NavLink>
            </li>

            {/* Admin + Operator */}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/shipments"
              >
                Shipments
              </NavLink>
            </li>

            {/* Admin Only */}
            {role === 'Admin' && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/customers"
                >
                  Customers
                </NavLink>
              </li>
            )}

            {/* Admin Only */}
            {role === 'Admin' && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/products"
                >
                  Products
                </NavLink>
              </li>
            )}

          </ul>

          {/* Logged-in user */}
          <div className="d-flex align-items-center gap-3">

            <div className="text-light text-end">
              <div className="small">
                {email}
              </div>

              <span className="badge bg-secondary">
                {role}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar