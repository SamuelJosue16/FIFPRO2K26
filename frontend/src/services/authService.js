import axiosInstance from '../lib/axios'

/**
 * Servicio de autenticación para comunicación con el backend
 */
export const authApi = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - { email, password, name }
   * @returns {Promise} - { user, token }
   */
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData)
    return response.data
  },

  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { user, token }
   */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Obtener perfil del usuario autenticado
   * @returns {Promise} - user data
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} profileData - { name, email }
   * @returns {Promise} - updated user data
   */
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData)
    return response.data
  },

  /**
   * Cambiar contraseña
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} - success message
   */
  changePassword: async (passwords) => {
    const response = await axiosInstance.put('/auth/change-password', passwords)
    return response.data
  }
}
