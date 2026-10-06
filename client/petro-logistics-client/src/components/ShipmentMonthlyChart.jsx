import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { dashboardService } from '../services/dashboardService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function ShipmentMonthlyChart() {
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        const data = await dashboardService.getShipmentsByMonth()
        setMonthlyData(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load monthly shipment data.')
      } finally {
        setLoading(false)
      }
    }

    loadMonthlyData()
  }, [])

  if (loading) return <p>Loading chart...</p>

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (monthlyData.length === 0) {
    return <p>No monthly shipment data available.</p>
  }

  const chartData = {
    labels: monthlyData.map(
      (item) => `${item.month}/${item.year}`
    ),
    datasets: [
      {
        label: 'Shipments',
        data: monthlyData.map((item) => item.count),
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">
          Shipments by Month
        </h5>

        <div style={{ height: '300px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default ShipmentMonthlyChart