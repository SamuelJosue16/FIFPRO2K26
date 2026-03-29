import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} - { user, token, loading, error, isAuthenticated, register, login, logout, updateProfile, changePassword }
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }

  return context
}
