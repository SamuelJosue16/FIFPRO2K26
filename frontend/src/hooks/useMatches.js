import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchesApi } from '../services/matchesService'

// Hook para obtener todos los partidos
export const useMatches = (params = {}) => {
  return useQuery({
    queryKey: ['matches', params],
    queryFn: () => matchesApi.getAll(params),
    select: (data) => data.data,
  })
}

// Hook para obtener partidos por estado
export const useMatchesByStatus = (status) => {
  return useQuery({
    queryKey: ['matches', 'status', status],
    queryFn: () => matchesApi.getByStatus(status),
    select: (data) => data.data,
    enabled: !!status,
  })
}

// Hook para obtener partidos de un equipo
export const useMatchesByTeam = (teamId) => {
  return useQuery({
    queryKey: ['matches', 'team', teamId],
    queryFn: () => matchesApi.getByTeam(teamId),
    select: (data) => data.data,
    enabled: !!teamId,
  })
}

// Hook para obtener un partido por ID
export const useMatch = (id) => {
  return useQuery({
    queryKey: ['matches', id],
    queryFn: () => matchesApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

// Hook para crear un partido
export const useCreateMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: matchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] }) // Actualizar contador de partidos
    },
  })
}

// Hook para actualizar un partido
export const useUpdateMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => matchesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['matches', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// Hook para eliminar un partido
export const useDeleteMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: matchesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
