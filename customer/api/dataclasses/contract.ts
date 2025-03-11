export type ContractType = 'agb_app_zum_doc_patient' | 'agb_mediquu_connect' | 'agb_app_zum_doc' |
  'agb_mediquu_netzmanager' | 'agb_mediquu_chat' | 'privacy_concept' | 'privacy_concept_tasks' |
  'avv' | 'avv_tasks' | 'nda' | 'sub' | 'tom'

export type Contract = {
  uuid: string,
  key: string,
  version: string,
  url?: string,
  createdAt: Date,
}
