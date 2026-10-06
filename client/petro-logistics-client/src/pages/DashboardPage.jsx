import { useEffect, useState } from 'react'

import { dashboardService } from '../services/dashboardService'

import ShipmentStatusChart from '../components/ShipmentStatusChart'
import ShipmentMonthlyChart from '../components/ShipmentMonthlyChart'
import TopDestinations from '../components/TopDestinations'
import TopProducts from '../components/TopProducts'
import RecentShipments from '../components/RecentShipments'

function DashboardPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await dashboardService.getStats()
            setStats(data)
        } catch (error) {
            console.error(error)
            setError('Failed to load dashboard statistics.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    Loading dashboard...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mt-4">


            <h2 className="mb-4">Dashboard</h2>

            <div className="row g-3">

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Total Shipments</h6>
                            <h2>{stats.totalShipments}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Pending</h6>
                            <h2>{stats.pendingShipments}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">In Transit</h6>
                            <h2>{stats.inTransitShipments}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Delivered</h6>
                            <h2>{stats.deliveredShipments}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Cancelled</h6>
                            <h2>{stats.cancelledShipments}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Total Quantity</h6>
                            <h2>{stats.totalQuantity}</h2>
                        </div>
                    </div>
                </div>

            </div>


            {/* Components */}
            <div className="row mt-4 g-4">

                {/* ShipmentStatusChart Components */}
                <div className="col-lg-6">
                    <ShipmentStatusChart />
                </div>

                {/* ShipmentMonthlyChart Components */}
                <div className="col-lg-6">
                    <ShipmentMonthlyChart />
                </div>

            </div>


            <div className="row mt-4 g-4">

                {/* TopDestinations Components */}
                <div className="col-lg-6">
                    <TopDestinations />
                </div>
                {/* TopProducts Components */}
                <div className="col-lg-6">
                    <TopProducts />
                </div>

            </div>

                {/* RecentShipments Components */}
            <div className="row mt-4 mb-4">
                <div className="col-12">
                    <RecentShipments />
                </div>
            </div>

        </div>
    )
}

export default DashboardPage