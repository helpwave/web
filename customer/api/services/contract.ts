import type { Contract } from '@/api/dataclasses/contract'

// TODO delete later
export const exampleContracts: Contract[] = [
  {
    uuid: '1',
    name: 'Contract 1',
    version: 'v1-2211',
    contractId: 'agb',
  },
  {
    uuid: '2',
    name: 'Contract 2',
    version: 'v2-7110',
    contractId: 'agb',
  },
  {
    uuid: '3',
    name: 'Contract 3',
    version: 'v1-9811',
    contractId: 'agb',
  }
]

export const ContractsAPI = {
  get:  async (id: string): Promise<Contract> => {
    const contract = exampleContracts.find(value => value.uuid === id)
    if (!contract) {
      throw new Error('Could not find contract')
    }
    return contract
  },
  getMany: async (): Promise<Contract[]>  => {
    return exampleContracts
  },
  /**
   * Returns all
   */
  getForProduct: async (_: string): Promise<Contract[]>  => {
    return exampleContracts
  },
}
