import api from './api'

const getShipments = async () => {
  const response = await api.get('/Shipments')

  return response.data
}

const searchShipments = async (filters) => {
  const response = await api.get('/Shipments/search', {
    params: filters,
  })

  return response.data
}

const createShipment = async (shipment) => {
  const response = await api.post('/Shipments', shipment)

  return response.data
}

const updateShipment = async (id, shipment) => {
  const response = await api.put(
    `/Shipments/${id}`,
    shipment
  )

  return response.data
}

const cancelShipment = async (id) => {
  const response = await api.patch(
    `/Shipments/${id}/cancel`
  )

  return response.data
}

// Get Shipment Status History
const getShipmentHistory = async (id) => {
  const response = await api.get(
    `/Shipments/${id}/history`
  )

  return response.data
}

export const shipmentService = {
  getShipments,
  searchShipments,
  createShipment,
  updateShipment,
  cancelShipment,
  getShipmentHistory,
}