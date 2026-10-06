import { useState } from 'react'
import { productService } from '../services/productService'

function CreateProductForm({
  onCreated,
  onCancel,
}) {

  // ==========================================
  // States
  // ==========================================

  const [formData, setFormData] = useState({
    name: '',
    productCode: '',
    category: '',
    unit: '',
    isHazardous: false,
    isActive: true,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')


  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox'
        ? checked
        : value,
    })
  }


  // ==========================================
  // Create Product
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)
      setError('')

      const request = {
        name: formData.name,
        productCode: formData.productCode,
        category: formData.category,
        unit: formData.unit,
        isHazardous: formData.isHazardous,
        isActive: formData.isActive,
      }

      await productService.createProduct(request)

      onCreated()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to create product.'

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
          Create Product
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
                Product Name
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


            {/* Product Code */}

            <div className="col-md-6">

              <label className="form-label">
                Product Code
              </label>

              <input
                type="text"
                className="form-control"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="Example: POLY-001"
                required
              />

            </div>


            {/* Category */}

            <div className="col-md-6">

              <label className="form-label">
                Category
              </label>

              <input
                type="text"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Petrochemical"
                required
              />

            </div>


            {/* Unit */}

            <div className="col-md-6">

              <label className="form-label">
                Unit
              </label>

              <input
                type="text"
                className="form-control"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Example: Ton"
                required
              />

            </div>


            {/* Hazardous */}

            <div className="col-md-6">

              <div className="form-check mt-2">

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isHazardous"
                  name="isHazardous"
                  checked={formData.isHazardous}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="isHazardous"
                >
                  Hazardous Product
                </label>

              </div>

            </div>


            {/* Active */}

            <div className="col-md-6">

              <div className="form-check mt-2">

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="isActive"
                >
                  Active Product
                </label>

              </div>

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
                : 'Create Product'}

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

export default CreateProductForm