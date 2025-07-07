import {
  CheckboxProperty,
  DateProperty,
  LoadingAndErrorComponent,
  MultiSelectProperty,
  NumberProperty,
  SingleSelectProperty,
  TextProperty
} from '@helpwave/hightide'
import type { Property } from '@helpwave/api-services/types/properties/property'
import type {
  AttachedProperty,
  AttachPropertySelectValue
} from '@helpwave/api-services/types/properties/attached_property'
import { emptyPropertyValue } from '@helpwave/api-services/types/properties/attached_property'
import { usePropertyQuery } from '@helpwave/api-services/mutations/properties/property_mutations'

type PropertyEntryDisplayProps = {
  property: Property,
  attachedProperty: AttachedProperty,
  onChange: (property: AttachedProperty) => void,
  onEditComplete: (property: AttachedProperty) => void,
  onRemove?: (property: AttachedProperty) => void,
  readOnly?: boolean,
}

/**
 * A component for displaying a PropertyEntry
 */
export const PropertyEntryDisplay = ({
                                       property,
                                       attachedProperty,
                                       onChange,
                                       onEditComplete,
                                       onRemove,
                                       readOnly = false
                                     }: PropertyEntryDisplayProps) => {
  const commonProps = {
    name: property.name,
    readOnly,
    onRemove: onRemove ? () => {
      onRemove({ ...attachedProperty, value: emptyPropertyValue })
    } : undefined,
  }

  // Util for making quick updates
  const updater = (update: (property: AttachedProperty) => void) => {
    const newProperty: AttachedProperty = {
      ...attachedProperty,
      value: { ...attachedProperty.value }
    }
    update(newProperty)
    return newProperty
  }

  switch (property.fieldType) {
    case 'text':
      return (
        <TextProperty
          {...commonProps}
          value={attachedProperty.value.textValue}
          onChange={textValue => onChange(updater(property1 => {
            property1.value.textValue = textValue
          }))}
          onEditComplete={textValue => onEditComplete(updater(property1 => {
            property1.value.textValue = textValue
          }))}
        />
      )
    case 'number':
      return (
        <NumberProperty
          {...commonProps}
          value={attachedProperty.value.numberValue}
          onChange={numberValue => onChange(updater(property1 => {
            property1.value.numberValue = numberValue
          }))}
          onEditComplete={numberValue => onEditComplete(updater(property1 => {
            property1.value.numberValue = numberValue
          }))}
        />
      )
    case 'date':
      return (
        <DateProperty
          {...commonProps}
          value={attachedProperty.value.dateValue}
          onChange={dateValue => {
            const newProperty = updater(property1 => {
              property1.value.dateValue = dateValue
            })
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
        />
      )
    case 'dateTime':
      return (
        <DateProperty
          {...commonProps}
          value={attachedProperty.value.dateTimeValue}
          onChange={dateValue => {
            const newProperty = updater(property1 => {
              property1.value.dateValue = dateValue
            })
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
        />
      )
    case 'checkbox':
      return (
        <CheckboxProperty
          // CheckboxProperty cannot have a onRemove because it is omitted, which must be enforced here
          {...{
            ...commonProps,
            onRemove: undefined
          }}
          value={attachedProperty.value.boolValue}
          onChange={boolValue => {
            const newProperty = updater(property1 => {
              property1.value.boolValue = boolValue
            })
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
        />
      )
    case 'singleSelect':
      return (
        <SingleSelectProperty<AttachPropertySelectValue>
          {...commonProps}
          value={attachedProperty.value.singleSelectValue}
          onChange={selectValue => {
            const newProperty = updater(property1 => {
              property1.value.singleSelectValue = selectValue
            })
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.selectData!.options
            .map(option => ({
              value: option,
              label: option.name,
              searchTags: [option.name]
            }))}
          selectedDisplayOverwrite={attachedProperty.value.singleSelectValue?.name}
        />
      )
    case 'multiSelect':
      return (
        <MultiSelectProperty<AttachPropertySelectValue>
          {...commonProps}
          onChange={multiSelect => {
            const newProperty: AttachedProperty = {
              ...attachedProperty,
              value: {
                ...attachedProperty.value,
                multiSelectValue: multiSelect
                  .filter(value => value.selected && value.value !== undefined)
                  .map(value => value.value)
              }
            }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.selectData!.options
            .filter(option => option !== undefined)
            .map(option => ({
              value: option,
              label: option.name,
              selected: !!attachedProperty.value.multiSelectValue.find(value => value.id === option.id),
              searchTags: [option.name]
            }))}
          isSearchEnabled={true}
          useChipDisplay={true}
        />
      )
    default:
      console.error(`Unimplemented property type used for PropertyEntry: ${property.fieldType}`)
      return <></>
  }
}

export type PropertyEntryProps = Omit<PropertyEntryDisplayProps, 'property'>

/**
 * A Component for mapping a properties to a specific type.
 *
 * It wraps the PropertyEntryDisplay with loading logic
 */
export const PropertyEntry = ({
                                attachedProperty,
                                ...restProps
                              }: PropertyEntryProps) => {
  const {
    data: property,
    isError,
    isLoading
  } = usePropertyQuery(attachedProperty.propertyId)

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError || !property}
      minimumLoadingDuration={500}
    >
      <PropertyEntryDisplay property={property!} attachedProperty={attachedProperty} {...restProps}/>
    </LoadingAndErrorComponent>
  )
}
