import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'

function RecentShipments() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecentShipments = async () => {
      try {
        const data = await dashboardService.getRecentShipments()
        setShipments(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load recent shipments.')
      } finally {
        setLoading(false)
      }
    }

    loadRecentShipments()
  }, [])

  if (loading) {
    return <p>Loading recent shipments...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        <h5 className="card-title mb-4">
          Recent Shipments
        </h5>

        {shipments.length === 0 ? (
          <p>No recent shipments available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>Shipment No.</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Shipment Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.shipmentNumber}</td>
                    <td>{shipment.customerName}</td>
                    <td>{shipment.productName}</td>
                    <td>{shipment.quantity}</td>
                    <td>{shipment.origin}</td>
                    <td>{shipment.destination}</td>

                    <td>
                      {new Date(
                        shipment.shipmentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {shipment.status}
                    </td>
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

export default RecentShipments