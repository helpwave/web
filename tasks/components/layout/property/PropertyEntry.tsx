import { TextProperty } from '@helpwave/common/components/properties/TextProperty'
import { NumberProperty } from '@helpwave/common/components/properties/NumberProperty'
import { DateProperty } from '@helpwave/common/components/properties/DateProperty'
import { CheckboxProperty } from '@helpwave/common/components/properties/CheckboxProperty'
import { SingleSelectProperty } from '@helpwave/common/components/properties/SelectProperty'
import { MultiSelectProperty } from '@helpwave/common/components/properties/MultiSelectProperty'
import type { PropertyWithValue } from '@/components/layout/property/property'

export type PropertyEntryProps = {
  property: PropertyWithValue,
  onChange: (property: PropertyWithValue) => void,
  onEditComplete: (property: PropertyWithValue) => void,
  readOnly?: boolean
}

/**
 * A Component for mapping a property to a specific type
 */
export const PropertyEntry = ({
  property,
  onChange,
  onEditComplete,
  readOnly = false
}: PropertyEntryProps) => {
  const commonProps = {
    name: property.basicInfo.propertyName,
    readOnly,
    softRequired: property.rules.importance === 'softRequired',
    onRemove: () => onChange({ ...property, value: {} }),
  }
  switch (property.field.fieldType) {
    case 'text':
      return (
        <TextProperty
          {...commonProps}
          value={property.value.text}
          onChange={text => onChange({ ...property, value: { text } })}
          onEditComplete={text => onEditComplete({ ...property, value: { text } })}
        />
      )
    case 'number':
      return (
        <NumberProperty
          {...commonProps}
          value={property.value.numberInput}
          onChange={numberInput => onChange({ ...property, value: { numberInput } })}
          onEditComplete={numberInput => onEditComplete({ ...property, value: { numberInput } })}
        />
      )
    case 'date':
      return (
        <DateProperty
          {...commonProps}
          value={property.value.date}
          onChange={date => {
            const newProperty = { ...property, value: { date } }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
        />
      )
    case 'checkbox':
      return (
        <CheckboxProperty
          // CheckboxProperty cannot have a onRemove because it is omitted
          {...{ ...commonProps, onRemove: undefined }}
          value={property.value.checkbox ?? false} // potentially inconsistent
          onChange={checkbox => {
            const newProperty: PropertyWithValue = { ...property, value: { checkbox } }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
        />
      )
    case 'singleSelect':
      return (
        <SingleSelectProperty<string>
          {...commonProps}
          value={property.value.singleSelect}
          onChange={singleSelect => {
            const newProperty: PropertyWithValue = { ...property, value: { singleSelect } }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.field.entryList
            .filter(option => option !== undefined)
            .map(option => ({ value: option!, label: option! }))}
          searchMapping={option => [option.value]}
        />
      )
    case 'multiSelect':
      return (
        <MultiSelectProperty<string>
          {...commonProps}
          onChange={multiSelect => {
            const newProperty: PropertyWithValue = {
              ...property,
              value: {
                multiSelect: multiSelect
                  .filter(value => value.selected && value.value !== undefined)
                  .map(value => value.value as string)
              }
            }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.field.entryList
            .filter(option => option !== undefined)
            .map(option => ({
              value: option!,
              label: option!,
              selected: !!property.value.multiSelect?.find(value => value === option)
            }))}
          search={{ searchMapping: value => [value.value] }}
        />
      )
    default:
      console.error(`incorrect property type: ${property.field.fieldType}`)
      return <></>
  }
}
