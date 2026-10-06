import api from './api'

const login = async (email, password) => {
  const response = await api.post('/Auth/login', {
    email,
    password,
  })

  return response.data
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('email')
  localStorage.removeItem('role')
  localStorage.removeItem('expiresAt')
}

const saveAuthData = (authData) => {
  localStorage.setItem('token', authData.token)
  localStorage.setItem('email', authData.email)
  localStorage.setItem('role', authData.role)
  localStorage.setItem(
    'expiresAt',
    authData.expiresAt
  )
}

const getToken = () => {
  return localStorage.getItem('token')
}

const getRole = () => {
  return localStorage.getItem('role')
}

const getEmail = () => {
  return localStorage.getItem('email')
}

const isAuthenticated = () => {
  const token = getToken()
  const expiresAt =
    localStorage.getItem('expiresAt')

  if (!token || !expiresAt) {
    return false
  }

  const expirationDate =
    new Date(expiresAt)

  if (expirationDate <= new Date()) {
    logout()
    return false
  }

  return true
}

export const authService = {
  login,
  logout,
  saveAuthData,
  getToken,
  getRole,
  getEmail,
  isAuthenticated,
}