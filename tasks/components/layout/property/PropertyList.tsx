import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Plus, Tag } from 'lucide-react'
import { TextProperty } from '@helpwave/common/components/properties/TextProperty'
import { NumberProperty } from '@helpwave/common/components/properties/NumberProperty'
import { DateProperty } from '@helpwave/common/components/properties/DateProperty'
import { SingleSelectProperty } from '@helpwave/common/components/properties/SelectProperty'
import { MultiSelectProperty } from '@helpwave/common/components/properties/MultiSelectProperty'
import { CheckboxProperty } from '@helpwave/common/components/properties/CheckboxProperty'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Span } from '@helpwave/common/components/Span'
import { Menu, MenuItem } from '@helpwave/common/components/user-input/Menu'
import type { PropertyWithValue, SubjectType } from '@/components/layout/property/property'
import {
  usePropertyListQuery, usePropertyWithValueCreateMutation,
  usePropertyWithValueListQuery,
  usePropertyWithValueUpdateMutation
} from '@/mutations/property_mutations'

type PropertyListTranslation = {
  properties: string,
  addProperty: string
}

const defaultPropertyListTranslation: Record<Languages, PropertyListTranslation> = {
  en: {
    properties: 'Properties',
    addProperty: 'Add Property'
  },
  de: {
    properties: 'Eigenschaften',
    addProperty: 'Eigenschaft hinzufügen'
  }
}

export type PropertyListProps = {
  subjectID: string,
  subjectType: SubjectType
}

/**
 * A component for listing properties for a subject
 */
export const PropertyList = ({
  overwriteTranslation,
  subjectID,
  subjectType
}: PropsForTranslation<PropertyListTranslation, PropertyListProps>) => {
  const translation = useTranslation(defaultPropertyListTranslation, overwriteTranslation)
  const {
    data: propertyList,
    isLoading: isLoadingPropertyList,
    isError: isErrorPropertyList
  } = usePropertyListQuery(subjectType)
  const { data: properties, isLoading, isError } = usePropertyWithValueListQuery(subjectID, subjectType)
  const updatePropertyMutation = usePropertyWithValueUpdateMutation()
  const createPropertyValue = usePropertyWithValueCreateMutation()

  // TODO update later
  const onChangeHandle = (updatedProperty: PropertyWithValue) => {
    updatePropertyMutation.mutate(updatedProperty)
  }

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
      loadingProps={{ classname: 'min-h-[200px] border-2 border-black rounded-xl' }}
    >
      <div className={tw('flex flex-col gap-y-2')}>
        <Tile
          title={{ value: translation.properties, type: 'title' }}
          prefix={<Tag className={tw('text-hw-primary-400')} size={20}/>}
          className={tw('!gap-x-2')}
        />
        {properties && properties.map((property, index) => {
          switch (property.field.fieldType) {
            case 'text':
              return (
                <TextProperty
                  key={index}
                  name={property.basicInfo.propertyName}
                  onRemove={() => updatePropertyMutation.mutate({ ...property, value: {} })}
                  onChange={text => onChangeHandle({ ...property, value: { text } })}
                />
              )
            case 'number':
              return (
                <NumberProperty
                  key={index}
                  name={property.basicInfo.propertyName}
                  onRemove={() => updatePropertyMutation.mutate({ ...property, value: {} })}
                  onChange={numberInput => onChangeHandle({ ...property, value: { numberInput } })}
                />
              )
            case 'date':
              return (
                <DateProperty
                  key={index}
                  name={property.basicInfo.propertyName}
                  onRemove={() => updatePropertyMutation.mutate({ ...property, value: {} })}
                  onChange={date => onChangeHandle({ ...property, value: { date } })}
                />
              )
            case 'checkbox':
              return (
                <CheckboxProperty
                  key={index}
                  name={property.basicInfo.propertyName}
                  value={property.value.checkbox ?? false} // potentially inconsistent
                  onChange={checkbox => onChangeHandle({ ...property, value: { checkbox } })}
                />
              )
            case 'singleSelect':
              return (
                <SingleSelectProperty<string>
                  key={index}
                  name={property.basicInfo.propertyName}
                  onRemove={() => updatePropertyMutation.mutate({ ...property, value: {} })}
                  onChange={singleSelect => onChangeHandle({ ...property, value: { singleSelect } })}
                  value={property.value.singleSelect}
                  options={property.field.entryList
                    .filter(option => option !== undefined)
                    .map(option => ({ value: option!, label: option! }))}
                  searchMapping={option => [option.value]}
                />
              )
            case 'multiSelect':
              return (
                <MultiSelectProperty<string>
                  key={index}
                  name={property.basicInfo.propertyName}
                  onRemove={() => updatePropertyMutation.mutate({ ...property, value: {} })}
                  onChange={multiSelect => onChangeHandle({
                    ...property,
                    value: {
                      multiSelect: multiSelect
                        .filter(value => value.selected && value.value !== undefined)
                        .map(value => value.value as string)
                    }
                  })}
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
        })}
        <Menu<HTMLDivElement> trigger={(onClick, ref) => (
          <div
            ref={ref}
            className={tw('flex flex-row px-4 py-2 gap-x-4 items-center border-2 border-dashed bg-gray-100 hover:border-hw-primary-400 rounded-2xl cursor-pointer')}
            onClick={onClick}
          >
            <Plus size={20}/>
            <Span>{translation.addProperty}</Span>
          </div>
        )}>
          <LoadingAndErrorComponent
            isLoading={isLoadingPropertyList}
            hasError={isErrorPropertyList}
          >
            {/* TODO searchbar here, possibly in a new component for list search */}
            {propertyList && properties && propertyList
              .filter(property => !properties.find(propertyWithValue => propertyWithValue.propertyId === property.id))
              .map(property => {
                return (
                  <MenuItem
                    key={property.id}
                    onClick={() => {
                      createPropertyValue.mutate({ ...property, propertyId: property.id, value: {}, id: subjectID })
                    }}>
                    {property.basicInfo.propertyName}
                  </MenuItem>
                )
              })}
          </LoadingAndErrorComponent>
        </Menu>
      </div>
    </LoadingAndErrorComponent>
  )
}
