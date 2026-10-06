import { useEffect, useState } from 'react'
import { productService } from '../services/productService'
import CreateProductForm from '../components/CreateProductForm'
import EditProductForm from '../components/EditProductForm'

function ProductsPage() {

  // ==========================================
  // States
  // ==========================================

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)

  const [editingProduct, setEditingProduct] =
    useState(null)

  const [deletingId, setDeletingId] =
    useState(null)


  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadProducts()
  }, [])


  // ==========================================
  // Load Products
  // ==========================================

  const loadProducts = async () => {

    try {

      setLoading(true)
      setError('')

      const data =
        await productService.getProducts()

      setProducts(data)

    } catch (err) {

      console.error(err)

      setError('Failed to load products.')

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // Product Created
  // ==========================================

  const handleProductCreated = async () => {

    setShowCreateForm(false)

    await loadProducts()
  }


  // ==========================================
  // Open Edit Form
  // ==========================================

  const handleEdit = (product) => {

    setShowCreateForm(false)

    setEditingProduct(product)
  }


  // ==========================================
  // Product Updated
  // ==========================================

  const handleProductUpdated = async () => {

    setEditingProduct(null)

    await loadProducts()
  }


  // ==========================================
  // Delete Product
  // ==========================================

  const handleDelete = async (product) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    )

    if (!confirmed) {
      return
    }

    try {

      setDeletingId(product.id)
      setError('')

      await productService.deleteProduct(
        product.id
      )

      // Close edit form if this product is open
      if (editingProduct?.id === product.id) {
        setEditingProduct(null)
      }

      // Reload products
      await loadProducts()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to delete product.'

      setError(message)

    } finally {

      setDeletingId(null)

    }
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-5">


      {/* ======================================
          Header
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="mb-0">
          Products
        </h2>


        <button
          className="btn btn-success"
          onClick={() => {

            setEditingProduct(null)

            setShowCreateForm(!showCreateForm)

          }}
        >

          {showCreateForm
            ? 'Close Form'
            : '+ New Product'}

        </button>

      </div>


      {/* ======================================
          Create Product Form
      ====================================== */}

      {showCreateForm && (

        <CreateProductForm
          onCreated={handleProductCreated}
          onCancel={() =>
            setShowCreateForm(false)
          }
        />

      )}


      {/* ======================================
          Edit Product Form
      ====================================== */}

      {editingProduct && (

        <EditProductForm
          product={editingProduct}
          onUpdated={handleProductUpdated}
          onCancel={() =>
            setEditingProduct(null)
          }
        />

      )}


      {/* ======================================
          Error
      ====================================== */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* ======================================
          Loading
      ====================================== */}

      {loading && (

        <div className="alert alert-info">
          Loading products...
        </div>

      )}


      {/* ======================================
          Products Table
      ====================================== */}

      {!loading && (

        <div className="table-responsive">

          <table className="table table-bordered table-striped align-middle">

            <thead className="table-dark">

              <tr>

                <th>Id</th>
                <th>Name</th>
                <th>Product Code</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Hazardous</th>
                <th>Active</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  <td>
                    {product.id}
                  </td>

                  <td>
                    {product.name}
                  </td>

                  <td>
                    {product.productCode}
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    {product.unit}
                  </td>


                  {/* Hazardous */}

                  <td>

                    {product.isHazardous ? (

                      <span className="badge bg-danger">
                        Yes
                      </span>

                    ) : (

                      <span className="badge bg-success">
                        No
                      </span>

                    )}

                  </td>


                  {/* Active */}

                  <td>

                    {product.isActive ? (

                      <span className="badge bg-success">
                        Active
                      </span>

                    ) : (

                      <span className="badge bg-secondary">
                        Inactive
                      </span>

                    )}

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="d-flex gap-2">

                      {/* Edit */}

                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          handleEdit(product)
                        }
                        disabled={
                          deletingId === product.id
                        }
                      >
                        Edit
                      </button>


                      {/* Delete */}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDelete(product)
                        }
                        disabled={
                          deletingId === product.id
                        }
                      >

                        {deletingId === product.id
                          ? 'Deleting...'
                          : 'Delete'}

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* No Products */}

          {products.length === 0 && (

            <div className="text-center text-muted py-4">
              No products found.
            </div>

          )}

        </div>

      )}

    </div>

  )
}

export default ProductsPage