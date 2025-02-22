import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/api/dataclasses/product'
import { QueryKeys } from '@/api/mutations/query_keys'

// TODO delete later
export const exampleProducts: Product[] = [
  {
    uuid: '1',
    name: 'helpwave tasks',
    plan: 'monthly',
    price: 10
  },
  {
    uuid: '2',
    name: 'mediquu',
    plan: 'once',
    price: 0
  },
  {
    uuid: '3',
    name: 'mediquu viva',
    plan: 'monthly',
    price: 5
  }
]

export const useProductsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.product, 'all'],
    queryFn: async () => {
      // TODO do request here
      return exampleProducts
    },
  })
}
