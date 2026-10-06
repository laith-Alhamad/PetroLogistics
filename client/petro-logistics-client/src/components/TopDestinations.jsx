import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'

function TopDestinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await dashboardService.getTopDestinations()
        setDestinations(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load top destinations.')
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  if (loading) {
    return <p>Loading destinations...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">

        <h5 className="card-title mb-4">
          Top Destinations
        </h5>

        {destinations.length === 0 ? (
          <p>No destination data available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Shipments</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {destinations.map((item) => (
                  <tr key={item.destination}>
                    <td>{item.destination}</td>
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

export default TopDestinations