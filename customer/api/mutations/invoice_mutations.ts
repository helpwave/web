import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Invoice } from '@/api/dataclasses/invoice'
import { exampleProducts } from '@/api/mutations/product_mutations'

export const useInvoiceQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.invoice, 'all'],
    queryFn: async () => {
      // TODO do request here
      const invoices: Invoice[] = [
        {
          uuid: '1',
          name: '0000110021',
          date: new Date(2025, 2, 1),
          paymentDate: new Date(2025, 2, 11),
          customerUUID: 'customer',
          status: 'payed',
          products: exampleProducts,
        },
        {
          uuid: '2',
          name: '0000110022',
          date: new Date(2025, 3, 1),
          paymentDate: new Date(2025, 3, 11),
          customerUUID: 'customer',
          status: 'payed',
          products: exampleProducts,
        },
        {
          uuid: '3',
          name: '0000110023',
          date: new Date(2025, 4, 1),
          paymentDate: new Date(2025, 4, 11),
          customerUUID: 'customer',
          status: 'payed',
          products: exampleProducts,
        },
        {
          uuid: '4',
          name: '0000110024',
          date: new Date(2025, 5, 1),
          paymentDate: new Date(2025, 5, 11),
          customerUUID: 'customer',
          status: 'pending',
          products: exampleProducts,
        },
        {
          uuid: '5',
          name: '0000110025',
          date: new Date(2025, 6, 1),
          customerUUID: 'customer',
          status: 'notPayed',
          products: [exampleProducts[0]!],
        },
        {
          uuid: '6',
          name: '0000110026',
          date: new Date(2025, 7, 1),
          customerUUID: 'customer',
          status: 'notPayed',
          products: [exampleProducts[0]!],
        }
      ]
      return invoices
    },
  })
}
