import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAdminStore from './store/adminAuthStore'

import AdminLayout from './layouts/AdminLayout'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ManageStudents from './pages/ManageStudents'
import ManageOlympiads from './pages/ManageOlympiads'
import ManageAnnouncements from './pages/ManageAnnouncements'

const ProtectedRoute = ({ children }) => {
  const { admin } = useAdminStore()
  if (!admin) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="schools" element={<div className="p-6">Schools management coming soon</div>} />
          <Route path="olympiads" element={<ManageOlympiads />} />
          <Route path="announcements" element={<ManageAnnouncements />} />
          <Route path="*" element={<div className="p-6">Page not found</div>} />
        </Route>
      </Routes>
    </>
  )
}
