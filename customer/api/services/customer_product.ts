import type { CustomerProduct, CustomerProductCreate } from '@/api/dataclasses/customer_product'
import { CustomerProductsHelper } from '@/api/dataclasses/customer_product'
import { API_URL } from '@/api/config'

export const CustomerProductsAPI = {
  create: async (customerProduct: CustomerProductCreate, headers: HeadersInit): Promise<CustomerProduct> => {
    const response = await fetch(`${API_URL}/customer/product/`, {
      method: 'POST',
      headers: { ...headers,'Content-Type': 'application/json' },
      body: JSON.stringify(CustomerProductsHelper.toJsonCreate(customerProduct))
    })
    if(response.ok) {
      return CustomerProductsHelper.fromJson(await response.json())
    }
    throw response
  },
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}/`, {
      method: 'GET',
      headers,
    })
    if(response.ok) {
      return CustomerProductsHelper.fromJson(await response.json())
    }
    throw response
  },
  delete: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}`, {
      method: 'Delete',
      headers: { ...headers,'Content-Type': 'application/json' },
    })
    if(response.ok) {
      return true
    }
    throw response
  },
  getAllForCustomer: async (headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/self/`, {
      method: 'GET',
      headers,
    })
    if(response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => CustomerProductsHelper.fromJson(value))
    }
    throw response
  },
}
