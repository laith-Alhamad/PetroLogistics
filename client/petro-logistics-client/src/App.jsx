import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import AccessDeniedPage from './pages/AccessDeniedPage'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Access Denied */}
        <Route
          path="/access-denied"
          element={<AccessDeniedPage />}
        />

        {/* Dashboard - Admin + Operator */}
        <Route
          path="/"
          element={
            <ProtectedRoute
              roles={['Admin', 'Operator']}
            >
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Shipments - Admin + Operator */}
        <Route
          path="/shipments"
          element={
            <ProtectedRoute
              roles={['Admin', 'Operator']}
            >
              <ShipmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Customers - Admin Only */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute roles={['Admin']}>
              <CustomersPage />
            </ProtectedRoute>
          }
        />

        {/* Products - Admin Only */}
        <Route
          path="/products"
          element={
            <ProtectedRoute roles={['Admin']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App