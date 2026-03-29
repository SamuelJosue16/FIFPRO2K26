import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de Request - Agregar token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de Response - Manejo de errores
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 401:
          // No autorizado - el AuthContext manejará esto
          console.warn('Token inválido o expirado')
          break
        case 403:
          console.error('Acceso prohibido')
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 500:
          console.error('Error del servidor')
          break
        default:
          console.error('Error en la respuesta:', error.response.data)
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Sin respuesta del servidor:', error.request)
    } else {
      // Error al configurar la petición
      console.error('Error en la configuración:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
