import { useEffect, useState } from 'react'
import { shipmentService } from '../services/shipmentService'

function ShipmentHistoryModal({
  shipment,
  onClose,
}) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ==========================================
  // Load History
  // ==========================================

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        setError('')

        const data =
          await shipmentService.getShipmentHistory(
            shipment.id
          )

        setHistory(data)

      } catch (err) {
        console.error(err)

        const message =
          err.response?.data?.detail ||
          err.response?.data?.title ||
          'Failed to load shipment history.'

        setError(message)

      } finally {
        setLoading(false)
      }
    }

    loadHistory()

  }, [shipment.id])


  // ==========================================
  // Status Badge
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark'

      case 'InTransit':
        return 'bg-primary'

      case 'Delivered':
        return 'bg-success'

      case 'Cancelled':
        return 'bg-danger'

      default:
        return 'bg-secondary'
    }
  }


  // ==========================================
  // Format Changed By
  // ==========================================

  const getChangedBy = (changedBy) => {
    if (!changedBy) {
      return 'Legacy Record'
    }

    return changedBy
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {/* Modal Background */}

      <div
        className="modal-backdrop fade show"
      ></div>


      {/* Modal */}

      <div
        className="modal fade show d-block"
        tabIndex="-1"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
        >
          <div className="modal-content">


            {/* Header */}

            <div className="modal-header">
              <div>
                <h5 className="modal-title">
                  Shipment Status History
                </h5>

                <div className="text-muted small">
                  {shipment.shipmentNumber}
                </div>
              </div>


              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>


            {/* Body */}

            <div className="modal-body">

              {loading && (
                <div className="text-center py-4">
                  <div
                    className="spinner-border"
                    role="status"
                  >
                  </div>

                  <div className="mt-2">
                    Loading history...
                  </div>
                </div>
              )}


              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}


              {!loading &&
                !error &&
                history.length === 0 && (
                  <div className="alert alert-info">
                    No status history found.
                  </div>
                )}


              {!loading &&
                !error &&
                history.length > 0 && (
                  <div className="table-responsive">

                    <table className="table align-middle">

                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Changed At</th>
                          <th>Changed By</th>
                        </tr>
                      </thead>


                      <tbody>

                        {history.map((item) => (
                          <tr key={item.id}>

                            {/* Status */}

                            <td>
                              <span
                                className={
                                  `badge ${getStatusClass(
                                    item.status
                                  )}`
                                }
                              >
                                {item.status}
                              </span>
                            </td>


                            {/* Changed At */}

                            <td>
                              {new Date(
                                item.changedAt
                              ).toLocaleString()}
                            </td>


                            {/* Changed By */}

                            <td>
                              {item.changedBy ? (
                                <span>
                                  {item.changedBy}
                                </span>
                              ) : (
                                <span className="text-muted">
                                  {getChangedBy(
                                    item.changedBy
                                  )}
                                </span>
                              )}
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

            </div>


            {/* Footer */}

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ShipmentHistoryModal