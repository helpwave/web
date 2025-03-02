import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { CustomerProductsAPI } from '@/api/services/customer_product'

export const useCustomerProductsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.customerProduct],
    queryFn: async () => {
      return await CustomerProductsAPI.getMany()
    },
  })
}
