import { QueryClient } from '@tanstack/react-query'

// Configuración del QueryClient con opciones UEFA themed
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      onError: (error) => {
        console.error('⚠️ Query Error:', error)
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('⚠️ Mutation Error:', error)
      },
    },
  },
})
