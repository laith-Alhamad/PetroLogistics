import { Link } from 'react-router-dom'

function AccessDeniedPage() {
  return (
    <div className="container">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '75vh' }}
      >
        <div className="text-center">
          <h1 className="display-1 fw-bold">
            403
          </h1>

          <h2 className="mb-3">
            Access Denied
          </h2>

          <p className="text-muted mb-4">
            You do not have permission to access
            this page.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AccessDeniedPage