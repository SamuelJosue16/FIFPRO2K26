import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playersApi } from '../services/playersService'

// Hook para obtener todos los jugadores
export const usePlayers = (params = {}) => {
  return useQuery({
    queryKey: ['players', params],
    queryFn: () => playersApi.getAll(params),
    select: (data) => data.data,
  })
}

// Hook para obtener jugadores por equipo
export const usePlayersByTeam = (teamId) => {
  return useQuery({
    queryKey: ['players', 'team', teamId],
    queryFn: () => playersApi.getByTeam(teamId),
    select: (data) => data.data,
    enabled: !!teamId,
  })
}

// Hook para obtener jugadores por posición
export const usePlayersByPosition = (position) => {
  return useQuery({
    queryKey: ['players', 'position', position],
    queryFn: () => playersApi.getByPosition(position),
    select: (data) => data.data,
    enabled: !!position,
  })
}

// Hook para obtener un jugador por ID
export const usePlayer = (id) => {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => playersApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

// Hook para crear un jugador
export const useCreatePlayer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: playersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] }) // También actualizar equipos por el contador
    },
  })
}

// Hook para actualizar un jugador
export const useUpdatePlayer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => playersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['players', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// Hook para eliminar un jugador
export const useDeletePlayer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: playersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
