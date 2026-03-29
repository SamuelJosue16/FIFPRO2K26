import axiosInstance from '../lib/axios'

// ============================================
// TEAMS API SERVICES
// ============================================

export const teamsApi = {
  // Obtener todos los equipos
  getAll: async () => {
    const response = await axiosInstance.get('/teams')
    return response.data
  },

  // Obtener un equipo por ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/teams/${id}`)
    return response.data
  },

  // Crear un equipo
  create: async (teamData) => {
    const response = await axiosInstance.post('/teams', teamData)
    return response.data
  },

  // Actualizar un equipo
  update: async (id, teamData) => {
    const response = await axiosInstance.put(`/teams/${id}`, teamData)
    return response.data
  },

  // Eliminar un equipo
  delete: async (id) => {
    const response = await axiosInstance.delete(`/teams/${id}`)
    return response.data
  }
}
