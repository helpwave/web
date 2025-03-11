// TODO delete later
import type { Customer, CustomerCreate } from '@/api/dataclasses/customer'
import { CustomerHelpers } from '@/api/dataclasses/customer'
import { API_URL } from '@/api/config'

export const CustomerAPI = {
  getMyself: async (headers?: HeadersInit): Promise<Customer | null> => {
    const data = await fetch(`${API_URL}/customer/`, { method: 'GET', headers: headers })
    if(data.status === 404) {
      return null
    }
    if(data.status === 200) {
      return CustomerHelpers.fromJson(await data.json())
    }
    throw data
  },
  create: async (customer: CustomerCreate, headers?: HeadersInit): Promise<Customer> => {
    console.log('json', CustomerHelpers.toJsonCreate(customer))
    const data = await fetch(`${API_URL}/customer/`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(CustomerHelpers.toJsonCreate(customer)),
    })
    return CustomerHelpers.fromJson(await data.json())
  },
  update: async (customer: Customer, headers?: HeadersInit) => {
    const data = await fetch(`${API_URL}/customer/`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(CustomerHelpers.toJson(customer)),
    })
    return CustomerHelpers.fromJson(await data.json())
  },
}
