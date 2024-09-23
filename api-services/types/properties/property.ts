export const subjectTypeList = ['patient', 'task'] as const
export type SubjectType = typeof subjectTypeList[number]

export const fieldTypeList = ['multiSelect', 'singleSelect', 'number', 'text', 'date', 'dateTime', 'checkbox'] as const
export type FieldType = typeof fieldTypeList[number]

export type SelectOption = {
  id: string,
  name: string,
  description?: string,
  isCustom: boolean
}

export type SelectData = {
  isAllowingFreetext: boolean,
  options: SelectOption[]
}

export type Property = {
  id: string,
  subjectType: SubjectType,
  fieldType: FieldType,
  name: string,
  description?: string,
  isArchived: boolean,
  setId?: string,
  selectData?: SelectData,
  alwaysIncludeForViewSource?: boolean
}

export const emptySelectOption: SelectOption = {
  id: '',
  name: 'Select Item',
  description: undefined,
  isCustom: false,
}
export const emptyProperty: Property = {
  id: '',
  name: 'Name',
  description: undefined,
  subjectType: 'patient',
  fieldType: 'multiSelect',
  selectData: {
    isAllowingFreetext: true,
    options: [
      {
        ...emptySelectOption,
        name: 'Select 1'
      },
      {
        ...emptySelectOption,
        name: 'Select 2'
      },
      {
        ...emptySelectOption,
        name: 'Select 3'
      },
    ]
  },
  isArchived: false,
  setId: undefined,
  alwaysIncludeForViewSource: false,
}
