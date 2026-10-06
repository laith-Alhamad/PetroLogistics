import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

import { dashboardService } from '../services/dashboardService'

ChartJS.register(ArcElement, Tooltip, Legend)

function ShipmentStatusChart() {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const data = await dashboardService.getShipmentsByStatus()
        setStatuses(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load shipment status chart.')
      } finally {
        setLoading(false)
      }
    }

    loadStatuses()
  }, [])

  if (loading) return <p>Loading chart...</p>

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (statuses.length === 0) {
    return <p>No shipment data available.</p>
  }

  const chartData = {
    labels: statuses.map((item) => item.status),
    datasets: [
      {
        label: 'Shipments',
        data: statuses.map((item) => item.count),
        backgroundColor: statuses.map((item) => {
          const colors = {
            Pending: '#ffc107',
            InTransit: '#0dcaf0',
            Delivered: '#198754',
            Cancelled: '#dc3545',
          }

          return colors[item.status] || '#6c757d'
        }),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">
          Shipments by Status
        </h5>

        <div style={{ height: '300px' }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default ShipmentStatusChart