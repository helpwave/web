import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { useAuth } from '@/hooks/useAuth'
import { VoucherAPI } from '@/api/services/voucher'

export const useVoucherQuery = (code?: string) => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.voucher, code],
    enabled: code !== undefined,
    queryFn: async () => {
      if(code === undefined) {
        throw new Error('invalid parameter')
      }
      return await VoucherAPI.get(code, authHeader)
    },
  })
}
