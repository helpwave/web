import type { Contract } from '@/api/dataclasses/contract'
import { ContractHelpers } from '@/api/dataclasses/contract'
import { API_URL } from '@/api/config'

export const ContractsAPI = {
  /** Get a Contract by its id */
  get:  async (id: string, headers: HeadersInit): Promise<Contract> => {
    const response = await fetch(`${API_URL}/contract/${id}`, {
      method: 'GET',
      headers: headers,
    })
    if(response.ok) {
      return ContractHelpers.fromJson(await response.json())
    }
    throw response
  },
  /**
   * Returns all contracts
   */
  getAll: async (headers: HeadersInit): Promise<Contract[]>  => {
    const response = await fetch(`${API_URL}/contract/`, {
      method: 'GET',
      headers: headers,
    })
    if(response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(json => ContractHelpers.fromJson(json))
    }
    throw response
  },
}
