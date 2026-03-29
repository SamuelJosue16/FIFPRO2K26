import axiosInstance from '../lib/axios'

// ============================================
// MATCHES API SERVICES
// ============================================

export const matchesApi = {
  // Obtener todos los partidos
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/matches', { params })
    return response.data
  },

  // Obtener partidos por estado
  getByStatus: async (status) => {
    const response = await axiosInstance.get('/matches', {
      params: { status }
    })
    return response.data
  },

  // Obtener partidos de un equipo
  getByTeam: async (teamId) => {
    const response = await axiosInstance.get('/matches', {
      params: { teamId }
    })
    return response.data
  },

  // Obtener un partido por ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/matches/${id}`)
    return response.data
  },

  // Crear un partido
  create: async (matchData) => {
    const response = await axiosInstance.post('/matches', matchData)
    return response.data
  },

  // Actualizar un partido
  update: async (id, matchData) => {
    const response = await axiosInstance.put(`/matches/${id}`, matchData)
    return response.data
  },

  // Eliminar un partido
  delete: async (id) => {
    const response = await axiosInstance.delete(`/matches/${id}`)
    return response.data
  }
}
