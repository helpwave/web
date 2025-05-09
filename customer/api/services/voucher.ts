import { API_URL } from '@/api/config'
import { VoucherHelpers } from '@/api/dataclasses/voucher'

export const VoucherAPI = {
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/voucher/${id}/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      const data = (await response.json())
      data['code'] = id
      return VoucherHelpers.fromJson(data)
    }
    throw response
  },
}
