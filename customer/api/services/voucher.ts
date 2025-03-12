import { API_URL } from '@/api/config'
import { VoucherHelpers } from '@/api/dataclasses/voucher'

export const VoucherAPI = {
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/voucher/${id}/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      return VoucherHelpers.fromJson(await response.json())
    }
    throw response
  },
}
