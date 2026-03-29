import { createContext, useState, useEffect } from 'react'
import { authApi } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Al montar, verificar si hay token guardado en localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))

          // Verificar que el token aún es válido
          const response = await authApi.getProfile()
          setUser(response.data)
        } catch (err) {
          // Token inválido o expirado, limpiar
          console.error('Token inválido:', err)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          setToken(null)
          setUser(null)
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  /**
   * Registrar nuevo usuario
   */
  const register = async (userData) => {
    try {
      setError(null)
      const response = await authApi.register(userData)

      const { user: newUser, token: newToken } = response.data

      // Guardar en estado y localStorage
      setUser(newUser)
      setToken(newToken)
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al registrar usuario'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Iniciar sesión
   */
  const login = async (credentials) => {
    try {
      setError(null)
      const response = await authApi.login(credentials)

      const { user: loggedUser, token: newToken } = response.data

      // Guardar en estado y localStorage
      setUser(loggedUser)
      setToken(newToken)
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(loggedUser))

      return { success: true, user: loggedUser }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Cerrar sesión
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  /**
   * Actualizar perfil del usuario
   */
  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const response = await authApi.updateProfile(profileData)

      const updatedUser = response.data

      // Actualizar estado y localStorage
      setUser(updatedUser)
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))

      return { success: true, user: updatedUser }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al actualizar perfil'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Cambiar contraseña
   */
  const changePassword = async (passwords) => {
    try {
      setError(null)
      await authApi.changePassword(passwords)
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al cambiar contraseña'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
