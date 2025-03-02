import type { CustomerProduct } from '@/api/dataclasses/customer_product'

const customerProductsData: CustomerProduct[] = [
  {
    uuid: '1',
    customerUUID: 'customer',
    productUUID: '1',
    startDate: new Date(2025, 1, 1),
    status: 'booked',
    contracts: []
  }
]

export const CustomerProductsAPI = {
  getMany: async () => {
    return customerProductsData
  },
  buy: async (_: CustomerProduct) => {
    // TODO
  },
  update: async (_: CustomerProduct) => {
    // TODO
  },
}
