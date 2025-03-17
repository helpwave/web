export type ContractType = 'agb_app_zum_doc_patient' | 'agb_mediquu_connect' | 'agb_app_zum_doc' |
  'agb_mediquu_netzmanager' | 'agb_mediquu_chat' | 'privacy_concept' | 'privacy_concept_tasks' |
  'avv' | 'avv_tasks' | 'nda' | 'sub' | 'tom'

export interface Contract {
  /** The unique identifier of the contract */
  uuid: string,
  /** The type of contract that determines its purpose */
  key: ContractType,
  /** The version of the contract */
  version: string,
  /** The URL at which the contract can be found as a file */
  url?: string,
  /** The creation day of the contract */
  createdAt: Date,
}

/**
 * Converts a JSON object to a Contract object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromJson = (json: any): Contract => {
  return {
    uuid: json.uuid,
    key: json.key,
    version: json.version,
    url: json.url,
    createdAt: new Date(json.created_at),
  }
}

/**
 * Converts a Contract object back to JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toJson = (customer: Contract): Record<string, any> => {
  return {
    uuid: customer.uuid,
    key: customer.key,
    version: customer.version,
    url: customer.url,
    created_at: customer.createdAt.toISOString(),
  }
}


export const ContractHelpers = { fromJson, toJson }
