import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Customer } from '@/api/dataclasses/customer'
import { CustomerAPI } from '@/api/services/customer'
import { useAuth } from '@/hooks/useAuth'

export const useCustomerMyselfQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.customer],
    queryFn: async () => {
      return await CustomerAPI.getMyself(authHeader)
    },
  })
}

export const useCustomerCreateMutation = () => {
  const queryClient = useQueryClient()
  const { authHeader } = useAuth()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      return await CustomerAPI.create(customer, authHeader)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient()
  const { authHeader } = useAuth()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      return await CustomerAPI.update(customer, authHeader)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}
