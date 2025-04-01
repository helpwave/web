import { API_URL } from '@/api/config'
import { ProductHelpers } from '@/api/dataclasses/product'

export type BookProductType = {
  uuid: string,
  plan_id: string,
  voucher?: string,
  accepted_contracts: string[],
}

export const ProductAPI = {
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/product/${id}/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      return ProductHelpers.fromJson(await response.json())
    }
    throw response
  },
  getAll: async (headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/product/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => ProductHelpers.fromJson(value))
    }
    throw response
  },
  book: async (product: BookProductType, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/product/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , ...headers },
      body: JSON.stringify(product)
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => ProductHelpers.fromJson(value))
    }
    throw response
  }
}
