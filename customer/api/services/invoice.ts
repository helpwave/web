import { API_URL } from '@/api/config'
import type { Invoice, InvoiceStatus } from '@/api/dataclasses/invoice'
import { InvoiceHelpers } from '@/api/dataclasses/invoice'

export const InvoiceAPI = {
  getMyInvoices: async (headers: HeadersInit): Promise<Invoice[]> => {
    const response = await fetch(`${API_URL}/invoice/self/`, { method: 'GET', headers })
    if(response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => InvoiceHelpers.fromJson(value))
    }
    throw response
  },
  pay: async (id: string, headers: HeadersInit): Promise<string> => {
    const response = await fetch(`${API_URL}/invoice/pay/${id}/`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
    if(response.ok) {
      return (await response.json()) as string
    }
    throw response
  },
  getStatus: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/invoice/status?${id}`, {
      method: 'GET',
      headers,
    })
    if(response.ok) {
      return (await response.json()) as InvoiceStatus
    }
    throw response
  },
}
