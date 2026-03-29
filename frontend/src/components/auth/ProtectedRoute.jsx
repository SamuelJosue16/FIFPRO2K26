import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige a login
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Mientras carga, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-uefa-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-uefa-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-uefa-silver text-lg">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, renderizar el children
  return children
}

export default ProtectedRoute
