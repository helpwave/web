import {
  FieldType as GRPCFieldType,
  SubjectType as GRPCSubjectType
} from '@helpwave/proto-ts/services/property_svc/v1/types_pb'

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
  selectData: SelectData,
  always_include_for_view_source?: boolean
}

export type PropertyValue = {
  textValue?: string,
  numberValue?: number,
  boolValue?: boolean,
  dateValue?: Date,
  dataTimeValue?: Date,
  selectValue?: string
}

export type AttachedProperty = {
  propertyId: string,
  subjectType: SubjectType,
  fieldType: FieldType,
  name: string,
  description?: string,
  value: PropertyValue
}

export type PropertyFieldType = {
  fieldType: FieldType,
  entryList: (string | undefined)[], // TODO allow different values later on
  isAllowingCustomValues: boolean
}

export const importanceList = ['optional', 'softRequired'] as const
export type ImportanceType = typeof importanceList[number]

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
  always_include_for_view_source: false,
}

export const subjectTypeMapperToGRPC = (subjectType: SubjectType): GRPCSubjectType => {
  switch (subjectType) {
    case 'patient':
      return GRPCSubjectType.SUBJECT_TYPE_PATIENT
    case 'task':
      return GRPCSubjectType.SUBJECT_TYPE_TASK
  }
}

export const subjectTypeMapperFromGRPC = (subjectType: GRPCSubjectType): SubjectType => {
  switch (subjectType) {
    case GRPCSubjectType.SUBJECT_TYPE_PATIENT:
      return 'patient'
    case GRPCSubjectType.SUBJECT_TYPE_TASK:
      return 'task'
    case GRPCSubjectType.SUBJECT_TYPE_UNSPECIFIED:
      throw Error('Unspecified SubjectType')
  }
}

export const fieldTypeMapperToGRPC = (fieldType: FieldType): GRPCFieldType => {
  switch (fieldType) {
    case 'number':
      return GRPCFieldType.FIELD_TYPE_NUMBER
    case 'text':
      return GRPCFieldType.FIELD_TYPE_TEXT
    case 'dateTime':
      return GRPCFieldType.FIELD_TYPE_DATE_TIME
    case 'date':
      return GRPCFieldType.FIELD_TYPE_DATE
    case 'checkbox':
      return GRPCFieldType.FIELD_TYPE_CHECKBOX
    case 'singleSelect':
      return GRPCFieldType.FIELD_TYPE_SELECT
    case 'multiSelect':
      // TODO change this when multiselect support is enabled
      return GRPCFieldType.FIELD_TYPE_UNSPECIFIED
  }
}

export const fieldTypeMapperFromGRPC = (fieldType: GRPCFieldType): FieldType => {
  switch (fieldType) {
    case GRPCFieldType.FIELD_TYPE_NUMBER:
      return 'number'
    case GRPCFieldType.FIELD_TYPE_TEXT:
      return 'text'
    case GRPCFieldType.FIELD_TYPE_DATE_TIME:
      return 'dateTime'
    case GRPCFieldType.FIELD_TYPE_DATE:
      return 'date'
    case GRPCFieldType.FIELD_TYPE_CHECKBOX:
      return 'checkbox'
    case GRPCFieldType.FIELD_TYPE_SELECT:
      return 'singleSelect'
    case GRPCFieldType.FIELD_TYPE_UNSPECIFIED:
      throw Error('Unspecified FieldType')
    // TODO change this when multiselect support is enabled
    // return 'multiSelect'
  }
}

export const propertyQueryKey: string = 'property'
