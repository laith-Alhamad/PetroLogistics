import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const authData = await authService.login(
        email,
        password
      )

      authService.saveAuthData(authData)

      navigate('/')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError(
          err.response?.data?.message ||
            'Unable to login. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-2">
                PetroLogistics
              </h2>

              <p className="text-muted text-center mb-4">
                Sign in to your account
              </p>

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? 'Signing in...'
                    : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage