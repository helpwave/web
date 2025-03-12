import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { ContractsAPI } from '@/api/services/contract'
import { useAuth } from '@/hooks/useAuth'

export const useContractQuery = (id?: string) => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.contract, id],
    enabled: id !== undefined,
    queryFn: async () => {
      if(id === undefined) {
        throw new Error('invalid parameter')
      }
      return await ContractsAPI.get(id, authHeader)
    },
  })
}

export const useContractsQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.contract, 'all'],
    queryFn: async () => {
      return await ContractsAPI.getAll(authHeader)
    },
  })
}

