import { CustomerProductsHelper } from '@/api/dataclasses/customer_product'
import { API_URL } from '@/api/config'
import { ProductHelpers } from '@/api/dataclasses/product'

export type BookProductType = {
  product_uuid: string,
  product_plan_uuid: string,
  voucher_uuid?: string,
  accepted_contracts: string[],
}

export const CustomerProductsAPI = {
  book: async (product: BookProductType, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(product)
    })
    if (response.ok) {
      return ProductHelpers.fromJson(await response.json())
    }
    throw response
  },
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      return CustomerProductsHelper.fromJson(await response.json())
    }
    throw response
  },
  delete: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}`, {
      method: 'Delete',
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
    if (response.ok) {
      return true
    }
    throw response
  },
  getAllForCustomer: async (headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/self/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => CustomerProductsHelper.fromJson(value))
    }
    throw response
  },
}
