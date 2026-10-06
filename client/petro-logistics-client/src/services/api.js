import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:44388/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==========================================
// Request Interceptor
// Add JWT to every request
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


// ==========================================
// Response Interceptor
// Handle expired / invalid JWT
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('role')
      localStorage.removeItem('expiresAt')

      // Avoid redirect loop when login itself returns 401
      if (
        !error.config?.url?.includes('/Auth/login')
      ) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api