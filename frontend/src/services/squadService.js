import axiosInstance from '../lib/axios'

export const squadApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/squads')
    return response.data
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/squads/${id}`)
    return response.data
  },

  create: async (squadData) => {
    const response = await axiosInstance.post('/squads', squadData)
    return response.data
  },

  update: async (id, squadData) => {
    const response = await axiosInstance.put(`/squads/${id}`, squadData)
    return response.data
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/squads/${id}`)
    return response.data
  },

  updatePositions: async (id, positions) => {
    const response = await axiosInstance.put(`/squads/${id}/positions`, { positions })
    return response.data
  },

  updateFormation: async (id, formation) => {
    const response = await axiosInstance.put(`/squads/${id}/formation`, { formation })
    return response.data
  },
}
