import api from './api'

const getStats = async () => {
  const response = await api.get('/Dashboard/stats')
  return response.data
}

const getShipmentsByStatus = async () => {
  const response = await api.get('/Dashboard/shipments-by-status')
  return response.data
}

const getShipmentsByMonth = async () => {
  const response = await api.get('/Dashboard/shipments-by-month')
  return response.data
}

const getTopDestinations = async () => {
  const response = await api.get('/Dashboard/top-destinations')
  return response.data
}

const getTopProducts = async () => {
  const response = await api.get('/Dashboard/top-products')
  return response.data
}

const getRecentShipments = async () => {
  const response = await api.get('/Dashboard/recent-shipments')
  return response.data
}

export const dashboardService = {
  getStats,
  getShipmentsByStatus,
  getShipmentsByMonth,
  getTopDestinations,
  getTopProducts,
  getRecentShipments,
}