import type { Contract } from '@/api/dataclasses/contract'

export const ContractsAPI = {
  get:  async (id: string): Promise<Contract> => {
    const contract = exampleContracts.find(value => value.uuid === id)
    if (!contract) {
      throw new Error('Could not find contract')
    }
    return contract
  },
  /**
   * Returns all
   */
  getForProduct: async (_: string): Promise<Contract[]>  => {
    return exampleContracts
  },
}
