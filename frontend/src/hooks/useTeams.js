import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamsApi } from '../services/teamsService'

// Hook para obtener todos los equipos
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getAll,
    select: (data) => data.data, // Extraer solo el array de equipos
  })
}

// Hook para obtener un equipo por ID
export const useTeam = (id) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamsApi.getById(id),
    select: (data) => data.data,
    enabled: !!id, // Solo ejecutar si hay ID
  })
}

// Hook para crear un equipo
export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => {
      // Invalidar y refrescar la lista de equipos
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// Hook para actualizar un equipo
export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => teamsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar la lista y el equipo específico
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] })
    },
  })
}

// Hook para eliminar un equipo
export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: teamsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
