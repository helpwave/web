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
  entryList: (string | undefined)[], // TODO allow different values later on
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

export type PropertyWithValue = IdentifiedProperty & {
  value: {
    // We potentially could not differentiate an empty value from a set value
    singleSelect?: string | undefined,
    multiSelect?: string[],
    numberInput?: number,
    checkbox?: boolean,
    text?: string,
    date?: Date
  }
}

export const emptyProperty: Property = {
  basicInfo: {
    propertyName: 'Name',
    subjectType: 'patient',
    description: ''
  },
  field: {
    fieldType: 'multiSelect',
    entryList: [undefined, undefined, undefined],
    isAllowingCustomValues: true
  },
  rules: {
    importance: 'optional',
    isAlwaysVisible: true
  }
}
