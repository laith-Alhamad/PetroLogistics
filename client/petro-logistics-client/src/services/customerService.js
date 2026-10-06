import api from './api'

const getCustomers = async () => {
  const response = await api.get('/Customers')

  return response.data
}

const createCustomer = async (customer) => {
  const response = await api.post(
    '/Customers',
    customer
  )

  return response.data
}

const updateCustomer = async (id, customer) => {
  const response = await api.put(
    `/Customers/${id}`,
    customer
  )

  return response.data
}

// Delete Customer
const deleteCustomer = async (id) => {
  const response = await api.delete(
    `/Customers/${id}`
  )

  return response.data
}

export const customerService = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}