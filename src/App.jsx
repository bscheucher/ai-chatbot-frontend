import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import { Profile } from './pages'

// Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Loading from './components/ui/Loading'

// Hooks
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, isLoading, checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/chat" replace /> : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/chat" replace /> : <Register />
          } 
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App