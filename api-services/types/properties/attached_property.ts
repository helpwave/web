import type { FieldType, SelectOption, SubjectType } from './property'

export type AttachPropertySelectValue = Omit<SelectOption, 'isCustom'>

export type PropertyValue = {
  textValue?: string,
  numberValue?: number,
  boolValue?: boolean,
  dateValue?: Date,
  dateTimeValue?: Date,
  singleSelectValue?: AttachPropertySelectValue,
  multiSelectValue: AttachPropertySelectValue[],
}

export const emptyPropertyValue: PropertyValue = {
  boolValue: undefined,
  textValue: undefined,
  numberValue: undefined,
  dateValue: undefined,
  dateTimeValue: undefined,
  singleSelectValue: undefined,
  multiSelectValue: []
}

/**
 * The value of properties attached to a subject
 *
 * This Object only stores the value.
 *
 * It is identified through the propertyId and the subjectType
 */
export type AttachedProperty = {
  /**
   * The identifier of the properties for which this is a value
   */
  propertyId: string,
  subjectId: string,
  value: PropertyValue,
}

export type DisplayableAttachedProperty = AttachedProperty & {
  subjectType: SubjectType,
  fieldType: FieldType,
  name: string,
  description?: string,
}
