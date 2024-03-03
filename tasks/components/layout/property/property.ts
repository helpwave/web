export const subjectTypeList = ['organization', 'ward', 'room', 'bed', 'patient'] as const
export type SubjectType = typeof subjectTypeList[number]

export type PropertyBasicInfo = {
  subjectType: SubjectType,
  propertyName: string, // TODO reconsider this
  description: string
}

export const fieldTypeList = ['multiSelect', 'singleSelect', 'number', 'text', 'date'] as const
export type FieldType = typeof fieldTypeList[number]

export type PropertyFieldType = {
  fieldType: FieldType,
  entryList: string[], // TODO allow different values later on
  isAllowingCustomValues: boolean
}

export const importanceList = ['optional', 'softRequired'] as const
export type ImportanceType = typeof importanceList[number]

export type PropertyRules = {
  importance: ImportanceType,
  isAlwaysVisible: boolean
}

export type Property = {
  basicInfo: PropertyBasicInfo,
  field: PropertyFieldType,
  rules: PropertyRules
}

export type IdentifiedProperty = Property & {
  id: string
}

export const emptyProperty: Property = {
  basicInfo: {
    propertyName: 'Name',
    subjectType: 'patient',
    description: ''
  },
  field: {
    fieldType: 'multiSelect',
    entryList: ['Test1', 'Test2', 'Test3'],
    isAllowingCustomValues: true
  },
  rules: {
    importance: 'optional',
    isAlwaysVisible: true
  }
}
