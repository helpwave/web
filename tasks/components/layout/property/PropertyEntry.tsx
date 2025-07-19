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
import type { AttachedProperty } from '@helpwave/api-services/types/properties/attached_property'
import { emptyPropertyValue } from '@helpwave/api-services/types/properties/attached_property'
import {
  usePropertyQuery,
  usePropertyUpdateMutation
} from '@helpwave/api-services/mutations/properties/property_mutations'
import { PropertyService } from '@helpwave/api-services/service/properties/PropertyService'

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

  const updatePropertyMutation = usePropertyUpdateMutation({
    onSuccess: (success, variables) => {
      if (!success) {
        return
      }
      PropertyService.get(property.id).then((property) => {
        const update = updater(attachedValue => {
          const option = property.selectData?.options.find(value => value.name === variables.selectUpdate?.add[0]?.name)
          if (!option) {
            return
          }
          if (property.fieldType === 'singleSelect') {
            attachedValue.value.singleSelectValue = option
          } else if (property.fieldType === 'multiSelect') {
            attachedValue.value.multiSelectValue = [...attachedValue.value.multiSelectValue, option]
          }
        })
        onChange(update)
        onEditComplete(update)
      })
    }
  })

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
        <SingleSelectProperty
          {...commonProps}
          value={attachedProperty.value.singleSelectValue?.id}
          onChange={selectedId => {
            const newProperty = updater(prev => {
              prev.value.singleSelectValue = property.selectData!.options.find(value => value.id === selectedId)
            })
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.selectData!.options
            .map(option => ({
              value: option.id,
              label: option.name,
              searchTags: [option.name]
            }))}
          onAddNew={(name) => {
            updatePropertyMutation.mutate({
              property,
              selectUpdate: {
                add: [
                  {
                    id: '',
                    name,
                    isCustom: true,
                  }
                ],
                update: [],
                remove: []
              },
            })
          }}
          selectedDisplayOverwrite={attachedProperty.value.singleSelectValue?.name}
          alignmentVertical="topOutside"
        />
      )
    case 'multiSelect':
      return (
        <MultiSelectProperty
          {...commonProps}
          onChange={multiSelect => {
            const newProperty: AttachedProperty = {
              ...attachedProperty,
              value: {
                ...attachedProperty.value,
                multiSelectValue: multiSelect
                  .filter(value => value.selected && value.value !== undefined)
                  .map(value => property.selectData!.options.find(option => option.id === value.value)!)
              }
            }
            onChange(newProperty)
            onEditComplete(newProperty)
          }}
          options={property.selectData!.options
            .filter(option => option !== undefined)
            .map(option => ({
              value: option.id,
              label: option.name,
              selected: !!attachedProperty.value.multiSelectValue.find(value => value.id === option.id),
              searchTags: [option.name]
            }))}
          onAddNew={(name) => {
            updatePropertyMutation.mutate({
              property,
              selectUpdate: {
                add: [
                  {
                    id: '',
                    name,
                    isCustom: true,
                  }
                ],
                update: [],
                remove: []
              },
            })
          }}
          useChipDisplay={true}
          alignmentVertical="topOutside"
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
      className="min-h-15"
    >
      <PropertyEntryDisplay property={property!} attachedProperty={attachedProperty} {...restProps}/>
    </LoadingAndErrorComponent>
  )
}
