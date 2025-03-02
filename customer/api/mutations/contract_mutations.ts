import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { ContractsAPI } from '@/api/services/contract'

export const useContractQuery = (id?: string) => {
  return useQuery({
    queryKey: [QueryKeys.contract, id],
    enabled: id !== undefined,
    queryFn: async () => {
      if(id === undefined) {
        return
      }
      return await ContractsAPI.get(id)
    },
  })
}

export const useContractsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.contract, 'all'],
    queryFn: async () => {
      return await ContractsAPI.getMany()
    },
  })
}

