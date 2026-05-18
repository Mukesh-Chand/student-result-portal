import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ResultPage from './pages/ResultPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<SearchPage />} />
  <Route path="/result" element={<ResultPage />} />
  <Route path="/admin" element={<AdminLoginPage />} />
  <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
</Routes>
    </BrowserRouter>
  )
}
