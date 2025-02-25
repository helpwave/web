import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Customer } from '@/api/dataclasses/customer'
import { CustomerAPI } from '@/api/services/customer'



export const useCustomerMyselfQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.customer],
    queryFn: async () => {
      return await CustomerAPI.getMyself()
    },
  })
}

export const useCustomerCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      return await CustomerAPI.create(customer)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      return await CustomerAPI.update(customer)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return await CustomerAPI.delete(id)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}
