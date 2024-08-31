import type { FieldType, SubjectType } from './property'

export type PropertyValue = {
  textValue: string,
  numberValue: number,
  boolValue: boolean,
  dateValue: Date,
  dateTimeValue: Date,
  singleSelectValue: string,
  multiSelectValue: string[]
}

export const emptyPropertyValue: PropertyValue = {
  boolValue: false,
  textValue: '',
  numberValue: 0,
  dateValue: new Date(),
  dateTimeValue: new Date(),
  singleSelectValue: '',
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
  value: PropertyValue
}

export type DisplayableAttachedProperty = AttachedProperty & {
  subjectType: SubjectType,
  fieldType: FieldType,
  name: string,
  description?: string
}
