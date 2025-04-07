import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { InputGroupProps } from '@helpwave/common/components/InputGroup'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Select } from '@helpwave/common/components/user-input/Select'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { tw } from '@helpwave/style-themes/twind'
import { Plus, X } from 'lucide-react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Input } from '@helpwave/common/components/user-input/Input'
import type { FieldType, Property, SelectData, SelectOption } from '@helpwave/api-services/types/properties/property'
import { fieldTypeList } from '@helpwave/api-services/types/properties/property'
import { useEffect, useState } from 'react'

type SelectDataUpdate = {
  create: number,
  update: (SelectOption & { index: number })[],
  delete: { id: string, index: number }[],
}

type PropertySelectOptionsUpdaterPropsTranslation = {
  newEntry: string,
  values: string,
}

const defaultPropertySelectOptionsUpdaterPropsTranslation: Record<Languages, PropertySelectOptionsUpdaterPropsTranslation> = {
  en: {
    newEntry: 'New Entry',
    values: 'Values',
  },
  de: {
    newEntry: 'Neuer Eintrag',
    values: 'Werte',
  }
}

type PropertySelectOptionsUpdaterProps = {
  value: SelectData,
  onChange: (data: SelectData, update: SelectDataUpdate) => void,
}

type PropertySelectOptionsUpdaterState = {
  data: SelectData,
  update: SelectDataUpdate,
}

export const PropertySelectOptionsUpdater = ({
  overwriteTranslation,
  value,
  onChange,
}: PropsForTranslation<PropertySelectOptionsUpdaterPropsTranslation, PropertySelectOptionsUpdaterProps>) => {
  const translation = useTranslation(defaultPropertySelectOptionsUpdaterPropsTranslation, overwriteTranslation)
  const [state, setState] = useState<PropertySelectOptionsUpdaterState>({ data: value, update: { create: 0, update: [], delete: [] } })
  const { data, update } = state

  useEffect(() => {
    setState({ data: value, update: { create: 0, update: [], delete: [] } })
  }, [value])

  return (
    <div className={tw('flex flex-col mt-2 gap-y-1')}>
      <div className={tw('flex flex-row justify-between items-center')}>
        <span className={tw('textstyle-label-md')}>{translation.values}</span>
        <Plus
          className={tw('text-white bg-hw-primary-400 hover:text-gray-100 hover:bg-hw-primary-600 rounded-full mr-3')}
          size={20}
          onClick={() => {
            onChange({ ...data }, { ...update, create: update.create + 1 })
          }}
        />
      </div>
      <Scrollbars autoHide autoHeight autoHeightMax={400}>
        <div className={tw('flex flex-col gap-y-2 mr-3')}>
          {data.options.map((entry, index) => (
            <div key={index} className={tw('flex flex-row items-center justify-between gap-x-4')}>
              <Input
                value={entry.name ?? ''}
                placeholder={`${translation.newEntry} ${index + 1}`}
                onChange={text => {
                  const newList = [...data.options]
                  const newEntry = { ...entry, name: text }
                  newList[index] = newEntry
                  setState(
                    { data: { ...data, options: newList }, update: { ...update, update: [...update.update, { ...newEntry, index }] } }
                  )
                }}
                onEditCompleted={text => {
                  const newList = [...data.options]
                  const newEntry = { ...entry, name: text }
                  newList[index] = newEntry
                  onChange(
                    { ...data, options: newList },
                    { ...update, update: [...update.update, { ...newEntry, index }] }
                  )
                }}
              />
              <X
                className={tw('text-hw-negative-400 hover:text-hw-negative-600')}
                size={20}
                onClick={() => {
                  const newList = data.options.filter((_, index1) => index1 !== index)
                  onChange(
                    { ...data, options: newList },
                    { ...update, delete: [...update.delete, { id: entry.id, index }] }
                  )
                }}
              />
            </div>
          ))}
        </div>
      </Scrollbars>
    </div>
  )
}

type PropertyFieldDetails = Pick<Property, 'fieldType' | 'selectData'>

type PropertyDetailsFieldTranslation = {
  field: string,
  fieldType: string,
  allowCustomValues: string,
  allowCustomValuesDescription: string,
} & { [key in FieldType]: string }

const defaultPropertyDetailsFieldTranslation: Record<Languages, PropertyDetailsFieldTranslation> = {
  en: {
    field: 'Field',
    fieldType: 'Field Type',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Number',
    text: 'Text',
    date: 'Date',
    dateTime: 'Date and Time',
    checkbox: 'Checkbox',
    allowCustomValues: 'Allow custom values',
    allowCustomValuesDescription: 'Let users enter a free text when the predefined values are not enough.',
  },
  de: {
    field: 'Property Eingabe', // TODO better translation
    fieldType: 'Property Typ',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Zahl',
    text: 'Text',
    date: 'Datum',
    dateTime: 'Datum und Zeit',
    checkbox: 'Checkbox',
    allowCustomValues: 'Hinzufügen neuer Werte',
    allowCustomValuesDescription: 'Werte können neu hinzugefügt werden,wenn sie nicht vorhanden sind.',
  }
}

export type PropertyDetailsFieldProps = {
  value: PropertyFieldDetails,
  onChange: (value: PropertyFieldDetails, update?: SelectDataUpdate) => void,
  inputGroupProps?: Omit<InputGroupProps, 'title'>,
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsField = ({
  overwriteTranslation,
  value,
  onChange,
  inputGroupProps
}: PropsForTranslation<PropertyDetailsFieldTranslation, PropertyDetailsFieldProps>) => {
  const translation = useTranslation(defaultPropertyDetailsFieldTranslation, overwriteTranslation)
  const [usedValue, setUsedValue] = useState<PropertyFieldDetails>(value)
  const isSelectType = value.fieldType === 'multiSelect' || value.fieldType === 'singleSelect'

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <InputGroup {...inputGroupProps} title={translation.field}>
      <Select
        // TODO add icons
        value={usedValue.fieldType}
        label={{ name: translation.fieldType, labelType: 'labelMedium' }}
        options={fieldTypeList.map(fieldType => ({ value: fieldType, label: translation[fieldType] }))}
        onChange={fieldType => {
          const newValue = { ...usedValue, fieldType }
          onChange(newValue)
        }}
      />
      {isSelectType && (
        <PropertySelectOptionsUpdater
          value={usedValue.selectData!}
          onChange={(selectData, update) => onChange({ ...usedValue, selectData }, update)}
        />
      )}
      {isSelectType && (
        <Tile
          title={{ value: translation.allowCustomValues, className: 'textstyle-label-md' }}
          description={{ value: translation.allowCustomValuesDescription }}
          suffix={(
            <Checkbox
              checked={usedValue.selectData!.isAllowingFreetext}
              onChange={isAllowingFreetext => {
                const newValue: PropertyFieldDetails = { ...value, selectData: { ...usedValue.selectData!, isAllowingFreetext } }
                onChange(newValue)
              }}
              size={20}
            />
          )}
          className={tw('mt-4')}
        />
      )}
    </InputGroup>
  )
}
