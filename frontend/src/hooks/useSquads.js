import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { squadApi } from '../services/squadService'

export const useSquads = () => {
  return useQuery({
    queryKey: ['squads'],
    queryFn: squadApi.getAll,
    select: (data) => data.data,
  })
}

export const useSquad = (id) => {
  return useQuery({
    queryKey: ['squads', id],
    queryFn: () => squadApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useCreateSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: squadApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useUpdateSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => squadApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useDeleteSquad = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: squadApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useUpdateSquadPositions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, positions }) => squadApi.updatePositions(id, positions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}
