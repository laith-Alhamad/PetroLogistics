import { useState } from 'react'
import { customerService } from '../services/customerService'

function CreateCustomerForm({
  onCreated,
  onCancel,
}) {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
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
  // Submit Customer
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)
      setError('')

      const request = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        address: formData.address,
      }

      await customerService.createCustomer(request)

      onCreated()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to create customer.'

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

        <h5 className="card-title mb-4">
          Create Customer
        </h5>


        {/* Error */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <div className="row g-3">


            {/* Name */}

            <div className="col-md-6">

              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email */}

            <div className="col-md-6">

              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Phone */}

            <div className="col-md-4">

              <label className="form-label">
                Phone
              </label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>


            {/* Country */}

            <div className="col-md-4">

              <label className="form-label">
                Country
              </label>

              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />

            </div>


            {/* Address */}

            <div className="col-md-4">

              <label className="form-label">
                Address
              </label>

              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
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
                : 'Create Customer'}

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

export default CreateCustomerForm