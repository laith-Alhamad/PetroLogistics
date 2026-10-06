import { useState } from 'react'
import { productService } from '../services/productService'

function EditProductForm({
  product,
  onUpdated,
  onCancel,
}) {

  // ==========================================
  // States
  // ==========================================

  const [formData, setFormData] = useState({
    name: product.name,
    productCode: product.productCode,
    category: product.category,
    unit: product.unit,
    isHazardous: product.isHazardous,
    isActive: product.isActive,
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
  // Update Product
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

      await productService.updateProduct(
        product.id,
        request
      )

      onUpdated()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to update product.'

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
          Edit Product
        </h5>

        <div className="text-muted mb-4">
          Product ID: {product.id}
        </div>


        {/* Error */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <div className="row g-3">


            {/* Product Name */}

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
                required
              />

            </div>


            {/* Hazardous */}

            <div className="col-md-6">

              <div className="form-check mt-2">

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="editIsHazardous"
                  name="isHazardous"
                  checked={formData.isHazardous}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="editIsHazardous"
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
                  id="editIsActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="editIsActive"
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

export default EditProductForm