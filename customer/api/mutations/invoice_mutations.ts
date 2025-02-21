import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Invoice } from '@/api/dataclasses/invoice'

export const useInvoiceQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.invoice, 'all'],
    queryFn: async () => {
      // TODO do request here
      const invoices: Invoice[] = [
        {
          uuid: '1',
          name: 'helpwave tasks February',
          creationDate: new Date(2025, 2, 1),
          paymentDate: new Date(2025, 2, 11),
          customerUUID: 'customer',
          status: 'payed'
        },
        {
          uuid: '2',
          name: 'helpwave tasks March',
          creationDate: new Date(2025, 3, 1),
          paymentDate: new Date(2025, 3, 11),
          customerUUID: 'customer',
          status: 'payed'
        },
        {
          uuid: '3',
          name: 'helpwave tasks April',
          creationDate: new Date(2025, 4, 1),
          paymentDate: new Date(2025, 4, 11),
          customerUUID: 'customer',
          status: 'payed'
        },
        {
          uuid: '4',
          name: 'helpwave tasks May',
          creationDate: new Date(2025, 5, 1),
          paymentDate: new Date(2025, 5, 11),
          customerUUID: 'customer',
          status: 'pending'
        },
        {
          uuid: '5',
          name: 'helpwave tasks June',
          creationDate: new Date(2025, 6, 1),
          customerUUID: 'customer',
          status: 'notPayed'
        },
        {
          uuid: '6',
          name: 'helpwave tasks July',
          creationDate: new Date(2025, 7, 1),
          customerUUID: 'customer',
          status: 'notPayed'
        }
      ]
      return invoices
    },
  })
}
