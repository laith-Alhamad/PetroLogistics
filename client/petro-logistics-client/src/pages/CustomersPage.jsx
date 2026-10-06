import { useEffect, useState } from 'react'
import { customerService } from '../services/customerService'
import CreateCustomerForm from '../components/CreateCustomerForm'
import EditCustomerForm from '../components/EditCustomerForm'

function CustomersPage() {

  // ==========================================
  // States
  // ==========================================

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)

  const [editingCustomer, setEditingCustomer] =
    useState(null)

  const [deletingId, setDeletingId] =
    useState(null)


  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadCustomers()
  }, [])


  // ==========================================
  // Load Customers
  // ==========================================

  const loadCustomers = async () => {

    try {

      setLoading(true)
      setError('')

      const data =
        await customerService.getCustomers()

      setCustomers(data)

    } catch (error) {

      console.error(error)

      setError('Failed to load customers.')

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // Customer Created
  // ==========================================

  const handleCustomerCreated = async () => {

    setShowCreateForm(false)

    await loadCustomers()
  }


  // ==========================================
  // Open Edit Form
  // ==========================================

  const handleEdit = (customer) => {

    setShowCreateForm(false)

    setEditingCustomer(customer)
  }


  // ==========================================
  // Customer Updated
  // ==========================================

  const handleCustomerUpdated = async () => {

    setEditingCustomer(null)

    await loadCustomers()
  }


  // ==========================================
  // Delete Customer
  // ==========================================

  const handleDelete = async (customer) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    )

    if (!confirmed) {
      return
    }

    try {

      setDeletingId(customer.id)
      setError('')

      await customerService.deleteCustomer(
        customer.id
      )

      // Close edit form if same customer is open
      if (editingCustomer?.id === customer.id) {
        setEditingCustomer(null)
      }

      // Reload customers
      await loadCustomers()

    } catch (err) {

      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Failed to delete customer.'

      setError(message)

    } finally {

      setDeletingId(null)

    }
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-5">


      {/* ======================================
          Header
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="mb-0">
          Customers
        </h2>


        <button
          className="btn btn-success"
          onClick={() => {

            setEditingCustomer(null)

            setShowCreateForm(!showCreateForm)

          }}
        >

          {showCreateForm
            ? 'Close Form'
            : '+ New Customer'}

        </button>

      </div>


      {/* ======================================
          Create Customer Form
      ====================================== */}

      {showCreateForm && (

        <CreateCustomerForm
          onCreated={handleCustomerCreated}
          onCancel={() =>
            setShowCreateForm(false)
          }
        />

      )}


      {/* ======================================
          Edit Customer Form
      ====================================== */}

      {editingCustomer && (

        <EditCustomerForm
          customer={editingCustomer}
          onUpdated={handleCustomerUpdated}
          onCancel={() =>
            setEditingCustomer(null)
          }
        />

      )}


      {/* ======================================
          Error
      ====================================== */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* ======================================
          Loading
      ====================================== */}

      {loading && (

        <div className="alert alert-info">
          Loading customers...
        </div>

      )}


      {/* ======================================
          Customers Table
      ====================================== */}

      {!loading && (

        <div className="table-responsive">

          <table className="table table-bordered table-striped align-middle">

            <thead className="table-dark">

              <tr>

                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Address</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {customers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    {customer.id}
                  </td>

                  <td>
                    {customer.name}
                  </td>

                  <td>
                    {customer.email}
                  </td>

                  <td>
                    {customer.phone}
                  </td>

                  <td>
                    {customer.country}
                  </td>

                  <td>
                    {customer.address}
                  </td>


                  {/* Actions */}

                  <td>

                    <div className="d-flex gap-2">

                      {/* Edit */}

                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          handleEdit(customer)
                        }
                        disabled={
                          deletingId === customer.id
                        }
                      >
                        Edit
                      </button>


                      {/* Delete */}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDelete(customer)
                        }
                        disabled={
                          deletingId === customer.id
                        }
                      >

                        {deletingId === customer.id
                          ? 'Deleting...'
                          : 'Delete'}

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* No Customers */}

          {customers.length === 0 && (

            <div className="text-center text-muted py-4">
              No customers found.
            </div>

          )}

        </div>

      )}

    </div>

  )
}

export default CustomersPage