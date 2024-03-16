import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Tag } from 'lucide-react'
import { TextProperty } from '@helpwave/common/components/properties/TextProperty'
import { NumberProperty } from '@helpwave/common/components/properties/NumberProperty'
import { DateProperty } from '@helpwave/common/components/properties/DateProperty'
import { SingleSelectProperty } from '@helpwave/common/components/properties/SelectProperty'
import { MultiSelectProperty } from '@helpwave/common/components/properties/MultiSelectProperty'
import type { PropertyWithValue } from '@/components/layout/property/property'

type PropertyListTranslation = {
  properties: string
}

const defaultPropertyListTranslation: Record<Languages, PropertyListTranslation> = {
  en: {
    properties: 'Properties'
  },
  de: {
    properties: 'Eigenschaften'
  }
}

export type PropertyListProps = {
  subjectID: string // TODO modify if more information are needed
}

/**
 * A component for listing properties for a subject
 */
export const PropertyList = ({
  overwriteTranslation,
  // subjectID,
}: PropsForTranslation<PropertyListTranslation, PropertyListProps>) => {
  const translation = useTranslation(defaultPropertyListTranslation, overwriteTranslation)
  const properties: PropertyWithValue[] = [] // TODO fetch from backend

  // TODO update later
  const removeMutation = (propertyID: string) => {
    return propertyID
  }

  // TODO update later
  const onChangeHandle = (updatedProperty: PropertyWithValue) => {
    console.log(updatedProperty)
  }

  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <Tile
        title={{ value: translation.properties, type: 'title' }}
        prefix={<Tag className={tw('text-hw-primary-400')}/>}
      />
      {properties.map((value) => {
        switch (value.field.fieldType) {
          case 'text':
            return (
              <TextProperty
                name={value.basicInfo.propertyName}
                onRemove={() => removeMutation(value.id)}
                onChange={text => onChangeHandle({ ...value, value: { text } })}
              />
            )
          case 'number':
            return (
              <NumberProperty
                name={value.basicInfo.propertyName}
                onRemove={() => removeMutation(value.id)}
                onChange={numberInput => onChangeHandle({ ...value, value: { numberInput } })}
              />
            )
          case 'date':
            return (
              <DateProperty
                name={value.basicInfo.propertyName}
                onRemove={() => removeMutation(value.id)}
                onChange={date => onChangeHandle({ ...value, value: { date } })}
              />
            )
          case 'singleSelect':
            return (
              <SingleSelectProperty<string>
                name={value.basicInfo.propertyName}
                onRemove={() => removeMutation(value.id)}
                onChange={singleSelect => onChangeHandle({ ...value, value: { singleSelect } })}
                value={value.value.singleSelect}
                options={value.field.entryList
                  .filter(option => option !== undefined)
                  .map(option => ({ value: option!, label: option! }))}
                searchMapping={option => [option.value]}
              />
            )
          case 'multiSelect':
            return (
              <MultiSelectProperty<string>
                name={value.basicInfo.propertyName}
                onRemove={() => removeMutation(value.id)}
                onChange={multiSelect => onChangeHandle({
                  ...value,
                  value: {
                    multiSelect: multiSelect
                      .filter(value => value.selected && value.value !== undefined)
                      .map(value => value.value as string)
                  }
                })}
                options={value.field.entryList
                  .filter(option => option !== undefined)
                  .map(option => ({
                    value: option!,
                    label: option!,
                    selected: !!value.value.multiSelect?.find(value => value === option)
                  }))}
                search={{ searchMapping: value => [value.value] }}
              />
            )
          default:
            console.error(`incorrect property type: ${value.field.fieldType}`)
            return <></>
        }
      })}
    </div>
  )
}
