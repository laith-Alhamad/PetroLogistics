import { useState } from 'react'
import { shipmentService } from '../services/shipmentService'

function EditShipmentForm({
  shipment,
  customers,
  products,
  onUpdated,
  onCancel,
}) {

  // ==========================================
  // Form State
  // ==========================================

  const [formData, setFormData] = useState({
    customerId: shipment.customerId,
    productId: shipment.productId,
    quantity: shipment.quantity,
    origin: shipment.origin,
    destination: shipment.destination,
    shipmentDate: shipment.shipmentDate
      ? shipment.shipmentDate.slice(0, 16)
      : '',
    status: shipment.status,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')


  // ==========================================
  // Handle Change
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // ==========================================
  // Submit Update
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)
      setError('')

      const request = {
        customerId: Number(formData.customerId),
        productId: Number(formData.productId),
        quantity: Number(formData.quantity),
        origin: formData.origin,
        destination: formData.destination,
        shipmentDate: formData.shipmentDate,
        status: formData.status,
      }

      await shipmentService.updateShipment(
        shipment.id,
        request
      )

      onUpdated()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to update shipment.'

      setError(message)

    } finally {

      setSaving(false)

    }
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="card shadow-sm mb-4">

      <div className="card-body">

        <h5 className="card-title mb-1">
          Edit Shipment
        </h5>

        {/* Shipment Number is read-only */}

        <div className="text-muted mb-4">
          {shipment.shipmentNumber}
        </div>


        {/* Error */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <div className="row g-3">


            {/* Customer */}

            <div className="col-md-4">

              <label className="form-label">
                Customer
              </label>

              <select
                className="form-select"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
              >

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
                value={formData.productId}
                onChange={handleChange}
                required
              >

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} - {product.productCode}
                  </option>

                ))}

              </select>

            </div>


            {/* Quantity */}

            <div className="col-md-4">

              <label className="form-label">
                Quantity
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

            </div>


            {/* Origin */}

            <div className="col-md-3">

              <label className="form-label">
                Origin
              </label>

              <input
                type="text"
                className="form-control"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />

            </div>


            {/* Destination */}

            <div className="col-md-3">

              <label className="form-label">
                Destination
              </label>

              <input
                type="text"
                className="form-control"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />

            </div>


            {/* Shipment Date */}

            <div className="col-md-3">

              <label className="form-label">
                Shipment Date
              </label>

              <input
                type="datetime-local"
                className="form-control"
                name="shipmentDate"
                value={formData.shipmentDate}
                onChange={handleChange}
                required
              />

            </div>


            {/* Status */}

            <div className="col-md-3">

              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >

                {shipment.status === 'Pending' && (
                  <>
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="InTransit">
                      In Transit
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </>
                )}


                {shipment.status === 'InTransit' && (
                  <>
                    <option value="InTransit">
                      In Transit
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </>
                )}


                {shipment.status === 'Delivered' && (
                  <option value="Delivered">
                    Delivered
                  </option>
                )}


                {shipment.status === 'Cancelled' && (
                  <option value="Cancelled">
                    Cancelled
                  </option>
                )}

              </select>

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-4">

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >

              {saving
                ? 'Saving...'
                : 'Save Changes'}

            </button>


            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}

export default EditShipmentForm