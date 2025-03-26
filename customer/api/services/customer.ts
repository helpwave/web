// TODO delete later
import type { Customer, CustomerCreate } from '@/api/dataclasses/customer'
import { CustomerHelpers } from '@/api/dataclasses/customer'
import { API_URL } from '@/api/config'

export const CustomerAPI = {
  getMyself: async (headers: HeadersInit): Promise<Customer | null> => {
    const response = await fetch(`${API_URL}/customer/`, { method: 'GET', headers: headers })
    if(response.status === 404) {
      return null
    }
    if(response.ok) {
      return CustomerHelpers.fromJson(await response.json())
    }
    throw response
  },
  create: async (customer: CustomerCreate, headers: HeadersInit): Promise<Customer> => {
    const response = await fetch(`${API_URL}/customer/`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(CustomerHelpers.toJsonCreate(customer)),
    })
    if(response.ok) {
      return CustomerHelpers.fromJson(await response.json())
    }
    throw response
  },
  update: async (customer: Customer, headers: HeadersInit) => {
    console.log(JSON.stringify(CustomerHelpers.toJsonUpdate(customer)))
    const response = await fetch(`${API_URL}/customer/`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(CustomerHelpers.toJsonUpdate(customer)),
    })
    if(response.ok) {
      return CustomerHelpers.fromJson(await response.json())
    }
    throw response
  },
}
