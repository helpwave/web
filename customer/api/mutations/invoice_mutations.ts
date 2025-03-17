import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import { InvoiceAPI } from '@/api/services/invoice'
import { useAuth } from '@/hooks/useAuth'

export const useMyInvoicesQuery = () => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.invoice, 'all'],
    queryFn: async () => {
      return InvoiceAPI.getMyInvoices(authHeader)
    },
  })
}

export const useInvoiceStatusQuery = (id?: string) => {
  const { authHeader } = useAuth()
  return useQuery({
    queryKey: [QueryKeys.invoice, 'status', id],
    enabled: id !== undefined,
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Invoice ID is required')
      }
      return InvoiceAPI.getStatus(id, authHeader)
    },
  })
}

