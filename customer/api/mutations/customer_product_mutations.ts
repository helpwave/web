import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { CustomerProductsAPI } from '@/api/services/customer_product'
import { useAuth } from '@/hooks/useAuth'
import type { CustomerProductCreate } from '@/api/dataclasses/customer_product'

export const useCustomerProductsSelfQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.customerProduct, 'self'],
    queryFn: async () => {
      return await CustomerProductsAPI.getAllForCustomer(authHeader)
    },
  })
}

export const useCustomerProductQuery = (id?: string) => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.customerProduct, id],
    enabled: id !== undefined,
    queryFn: async () => {
      if(id === undefined) {
        throw 'Invalid id'
      }
      return await CustomerProductsAPI.get(id, authHeader)
    },
  })
}

export const useCustomerProductDeleteMutation = () => {
  const queryClient = useQueryClient()
  const { authHeader } = useAuth()
  return useMutation({
    mutationFn: async (id: string) => {
      return await CustomerProductsAPI.delete(id, authHeader)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerCreateMutation = () => {
  const queryClient = useQueryClient()
  const { authHeader } = useAuth()
  return useMutation({
    mutationFn: async (customer: CustomerProductCreate) => {
      return await CustomerProductsAPI.create(customer, authHeader)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer, 'self']).catch(reason => console.error(reason))
    }
  })
}
