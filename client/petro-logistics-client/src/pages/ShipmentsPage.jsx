import { useEffect, useState } from 'react'
import { shipmentService } from '../services/shipmentService'
import { customerService } from '../services/customerService'
import { productService } from '../services/productService'
import CreateShipmentForm from '../components/CreateShipmentForm'
import EditShipmentForm from '../components/EditShipmentForm'
import ShipmentHistoryModal from '../components/ShipmentHistoryModal'
function ShipmentsPage() {

  // ==========================================
  // States
  // ==========================================

  const [shipments, setShipments] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [historyShipment, setHistoryShipment] = useState(null)

  const [filters, setFilters] = useState({
    status: '',
    customerId: '',
    productId: '',
    origin: '',
    destination: '',
    fromDate: '',
    toDate: '',
    pageNumber: 1,
    pageSize: 2,
  })

  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Used to disable Cancel while request is running
  const [cancellingId, setCancellingId] = useState(null)


  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadInitialData()
  }, [])


  // ==========================================
  // Load Initial Data
  // ==========================================

  const loadInitialData = async () => {

    try {

      setLoading(true)
      setError('')

      const [
        customersData,
        productsData,
        shipmentsData,
      ] = await Promise.all([
        customerService.getCustomers(),
        productService.getProducts(),
        shipmentService.searchShipments(filters),
      ])

      setCustomers(customersData)
      setProducts(productsData)

      setShipments(shipmentsData.items)
      setTotalCount(shipmentsData.totalCount)
      setTotalPages(shipmentsData.totalPages)

    } catch (err) {

      console.error(err)

      setError('Failed to load shipment data.')

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // Load / Search Shipments
  // ==========================================

  const loadShipments = async (searchFilters) => {

    try {

      setLoading(true)
      setError('')

      const data =
        await shipmentService.searchShipments(searchFilters)

      setShipments(data.items)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)

    } catch (err) {

      console.error(err)

      setError('Failed to load shipments.')

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // Filter Change
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFilters({
      ...filters,
      [name]: value,
    })
  }


  // ==========================================
  // Search
  // ==========================================

  const handleSearch = () => {

    const updatedFilters = {
      ...filters,
      pageNumber: 1,
    }

    setFilters(updatedFilters)

    loadShipments(updatedFilters)
  }


  // ==========================================
  // Reset
  // ==========================================

  const handleReset = () => {

    const resetFilters = {
      status: '',
      customerId: '',
      productId: '',
      origin: '',
      destination: '',
      fromDate: '',
      toDate: '',
      pageNumber: 1,
      pageSize: 2,
    }

    setFilters(resetFilters)

    loadShipments(resetFilters)
  }


  // ==========================================
  // Pagination
  // ==========================================

  const handlePageChange = (newPage) => {

    if (newPage < 1 || newPage > totalPages) {
      return
    }

    const updatedFilters = {
      ...filters,
      pageNumber: newPage,
    }

    setFilters(updatedFilters)

    loadShipments(updatedFilters)
  }


  // ==========================================
  // Shipment Created
  // ==========================================

  const handleShipmentCreated = () => {

    setShowCreateForm(false)

    const resetFilters = {
      status: '',
      customerId: '',
      productId: '',
      origin: '',
      destination: '',
      fromDate: '',
      toDate: '',
      pageNumber: 1,
      pageSize: 2,
    }

    setFilters(resetFilters)

    loadShipments(resetFilters)
  }


  // ==========================================
  // Open Edit Form
  // ==========================================

  const handleEdit = (shipment) => {

    setShowCreateForm(false)

    setEditingShipment(shipment)
  }


  // ==========================================
  // Shipment Updated
  // ==========================================

  const handleShipmentUpdated = () => {

    setEditingShipment(null)

    loadShipments(filters)
  }


  // ==========================================
  // Cancel Shipment
  // ==========================================

  const handleCancelShipment = async (shipment) => {

    const confirmed = window.confirm(
      `Are you sure you want to cancel shipment ${shipment.shipmentNumber}?`
    )

    if (!confirmed) {
      return
    }

    try {

      setError('')
      setCancellingId(shipment.id)

      await shipmentService.cancelShipment(
        shipment.id
      )

      // Close edit form if same shipment was open
      if (editingShipment?.id === shipment.id) {
        setEditingShipment(null)
      }

      // Reload current page
      await loadShipments(filters)

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to cancel shipment.'

      setError(message)

    } finally {

      setCancellingId(null)

    }
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-4">


      {/* ======================================
          Header
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="mb-0">
          Shipments
        </h2>

        <button
          className="btn btn-success"
          onClick={() => {

            setEditingShipment(null)

            setShowCreateForm(!showCreateForm)

          }}
        >

          {showCreateForm
            ? 'Close Form'
            : '+ New Shipment'}

        </button>

      </div>


      {/* ======================================
          Create Shipment
      ====================================== */}

      {showCreateForm && (

        <CreateShipmentForm
          customers={customers}
          products={products}
          onCreated={handleShipmentCreated}
          onCancel={() =>
            setShowCreateForm(false)
          }
        />

      )}


      {/* ======================================
          Edit Shipment
      ====================================== */}

      {editingShipment && (

        <EditShipmentForm
          shipment={editingShipment}
          customers={customers}
          products={products}
          onUpdated={handleShipmentUpdated}
          onCancel={() =>
            setEditingShipment(null)
          }
        />

      )}


      {/* ======================================
          Search
      ====================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="card-title mb-4">
            Search Shipments
          </h5>


          <div className="row g-3">


            {/* Status */}

            <div className="col-md-4">

              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleChange}
              >

                <option value="">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="InTransit">
                  In Transit
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>


            {/* Customer */}

            <div className="col-md-4">

              <label className="form-label">
                Customer
              </label>

              <select
                className="form-select"
                name="customerId"
                value={filters.customerId}
                onChange={handleChange}
              >

                <option value="">
                  All Customers
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>

                ))}

              </select>

            </div>


            {/* Product */}

            <div className="col-md-4">

              <label className="form-label">
                Product
              </label>

              <select
                className="form-select"
                name="productId"
                value={filters.productId}
                onChange={handleChange}
              >

                <option value="">
                  All Products
                </option>

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>

                ))}

              </select>

            </div>


            {/* Origin */}

            <div className="col-md-4">

              <label className="form-label">
                Origin
              </label>

              <input
                type="text"
                className="form-control"
                name="origin"
                value={filters.origin}
                onChange={handleChange}
                placeholder="Example: Aqaba"
              />

            </div>


            {/* Destination */}

            <div className="col-md-4">

              <label className="form-label">
                Destination
              </label>

              <input
                type="text"
                className="form-control"
                name="destination"
                value={filters.destination}
                onChange={handleChange}
                placeholder="Example: Amman"
              />

            </div>


            {/* From Date */}

            <div className="col-md-2">

              <label className="form-label">
                From Date
              </label>

              <input
                type="date"
                className="form-control"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleChange}
              />

            </div>


            {/* To Date */}

            <div className="col-md-2">

              <label className="form-label">
                To Date
              </label>

              <input
                type="date"
                className="form-control"
                name="toDate"
                value={filters.toDate}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="mt-4">

            <button
              className="btn btn-primary me-2"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          Error
      ====================================== */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* ======================================
          Shipments Table
      ====================================== */}

      <div className="card shadow-sm">

        <div className="card-body">

          {loading ? (

            <div className="alert alert-info mb-0">
              Loading shipments...
            </div>

          ) : (

            <>

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
                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody>

                    {shipments.map((shipment) => {

                      const isFinalStatus =
                        shipment.status === 'Delivered' ||
                        shipment.status === 'Cancelled'

                      return (

                        <tr key={shipment.id}>

                          <td>
                            {shipment.shipmentNumber}
                          </td>

                          <td>
                            {shipment.customerName}
                          </td>

                          <td>

                            {shipment.productName}

                            <div className="small text-muted">
                              {shipment.productCode}
                            </div>

                          </td>

                          <td>
                            {shipment.quantity}
                          </td>

                          <td>
                            {shipment.origin}
                          </td>

                          <td>
                            {shipment.destination}
                          </td>

                          <td>
                            {new Date(
                              shipment.shipmentDate
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            {shipment.status}
                          </td>


                          {/* Actions */}

                          <td>

                            <div className="d-flex gap-2">

                              {/* Edit */}

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  handleEdit(shipment)
                                }
                                disabled={isFinalStatus}
                              >
                                Edit
                              </button>


                              {/* Cancel */}

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleCancelShipment(shipment)
                                }
                                disabled={
                                  isFinalStatus ||
                                  cancellingId === shipment.id
                                }
                              >

                                {cancellingId === shipment.id
                                  ? 'Cancelling...'
                                  : 'Cancel'}

                              </button>

                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setHistoryShipment(shipment)}
                              >
                                History
                              </button>

                            </div>

                          </td>

                        </tr>

                      )

                    })}

                  </tbody>

                </table>

              </div>


              {/* No Results */}

              {shipments.length === 0 && (

                <div className="text-center text-muted py-4">
                  No shipments found.
                </div>

              )}


              {/* ==================================
                  Pagination
              ================================== */}

              <div className="d-flex justify-content-between align-items-center mt-3">

                <div className="text-muted">
                  Total Results: {totalCount}
                </div>


                <div className="d-flex align-items-center gap-2">

                  <button
                    className="btn btn-outline-secondary"
                    disabled={filters.pageNumber <= 1}
                    onClick={() =>
                      handlePageChange(
                        filters.pageNumber - 1
                      )
                    }
                  >
                    Previous
                  </button>


                  <span>
                    Page {filters.pageNumber} of {totalPages}
                  </span>


                  <button
                    className="btn btn-outline-secondary"
                    disabled={
                      totalPages === 0 ||
                      filters.pageNumber >= totalPages
                    }
                    onClick={() =>
                      handlePageChange(
                        filters.pageNumber + 1
                      )
                    }
                  >
                    Next
                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

      {/* ======================================
          Shipment History Modal
      ====================================== */}

      {historyShipment && (

        <ShipmentHistoryModal
          shipment={historyShipment}
          onClose={() => setHistoryShipment(null)}
        />

      )}

    </div>
  )
}

export default ShipmentsPage