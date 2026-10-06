import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'

function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await dashboardService.getTopProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load top products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <p>Loading products...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">

        <h5 className="card-title mb-4">
          Top Products
        </h5>

        {products.length === 0 ? (
          <p>No product data available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Code</th>
                  <th>Shipments</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.productCode}</td>
                    <td>{item.shipmentCount}</td>
                    <td>{item.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default TopProducts