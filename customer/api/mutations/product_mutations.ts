import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { ProductAPI } from '@/api/services/product'
import { useAuth } from '@/hooks/useAuth'

export const useProductsAllQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.product, 'all'],
    queryFn: async () => {
      return await ProductAPI.getAll(authHeader)
    },
  })
}

export const useProductsAvailableQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.product, 'available'],
    queryFn: async () => {
      return await ProductAPI.getAvailable(authHeader)
    },
  })
}

export const useProductQuery = (id?: string) => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.product, id],
    enabled: id !== undefined,
    queryFn: async () => {
      if(id === undefined) {
        throw new Error('invalid id')
      }
      return await ProductAPI.get(id, authHeader)
    },
  })
}
