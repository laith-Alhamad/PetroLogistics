import { useState } from 'react'
import { shipmentService } from '../services/shipmentService'

function CreateShipmentForm({
  customers,
  products,
  onCreated,
  onCancel,
}) {

  const [formData, setFormData] = useState({
    shipmentNumber: '',
    customerId: '',
    productId: '',
    quantity: '',
    origin: '',
    destination: '',
    shipmentDate: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')


  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)
      setError('')

      const request = {
        shipmentNumber: formData.shipmentNumber,
        customerId: Number(formData.customerId),
        productId: Number(formData.productId),
        quantity: Number(formData.quantity),
        origin: formData.origin,
        destination: formData.destination,
        shipmentDate: formData.shipmentDate,
      }

      await shipmentService.createShipment(request)

      onCreated()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to create shipment.'

      setError(message)

    } finally {

      setSaving(false)

    }
  }


  return (

    <div className="card shadow-sm mb-4">

      <div className="card-body">

        <h5 className="card-title mb-4">
          Create New Shipment
        </h5>


        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <div className="row g-3">


            {/* Shipment Number */}

            <div className="col-md-4">

              <label className="form-label">
                Shipment Number
              </label>

              <input
                type="text"
                className="form-control"
                name="shipmentNumber"
                value={formData.shipmentNumber}
                onChange={handleChange}
                placeholder="Example: SHP-2026-007"
                required
              />

            </div>


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

                <option value="">
                  Select Customer
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
                value={formData.productId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Product
                </option>

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

            <div className="col-md-3">

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

          </div>


          {/* Buttons */}

          <div className="mt-4">

            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={saving}
            >

              {saving
                ? 'Saving...'
                : 'Create Shipment'}

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

export default CreateShipmentForm