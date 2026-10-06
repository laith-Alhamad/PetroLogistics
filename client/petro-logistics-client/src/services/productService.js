import api from './api'

const getProducts = async () => {
  const response = await api.get('/Products')

  return response.data
}

const createProduct = async (product) => {
  const response = await api.post(
    '/Products',
    product
  )

  return response.data
}

const updateProduct = async (id, product) => {
  const response = await api.put(
    `/Products/${id}`,
    product
  )

  return response.data
}

// Delete Product
const deleteProduct = async (id) => {
  const response = await api.delete(
    `/Products/${id}`
  )

  return response.data
}

export const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}