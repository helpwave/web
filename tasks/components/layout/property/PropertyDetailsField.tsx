import { Expandable, IconButton } from '@helpwave/hightide'
import type { PropsForTranslation , ExpandableProps, Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { Tile } from '@helpwave/hightide'
import { Checkbox } from '@helpwave/hightide'
import { Plus, X } from 'lucide-react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Input } from '@helpwave/hightide'
import type { FieldType, Property, SelectData, SelectOption } from '@helpwave/api-services/types/properties/property'
import { fieldTypeList } from '@helpwave/api-services/types/properties/property'
import { useEffect, useState } from 'react'
import { TextButton } from '@helpwave/hightide'

type SelectDataUpdate = {
  create: number,
  update: (SelectOption & { index: number })[],
  delete: { id: string, index: number }[],
}

type PropertySelectOptionsUpdaterPropsTranslation = {
  newEntry: string,
  values: string,
}

const defaultPropertySelectOptionsUpdaterPropsTranslation: Translation<PropertySelectOptionsUpdaterPropsTranslation> = {
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
  const [state, setState] = useState<PropertySelectOptionsUpdaterState>({
    data: value,
    update: { create: 0, update: [], delete: [] }
  })
  const { data, update } = state

  useEffect(() => {
    setState({ data: value, update: { create: 0, update: [], delete: [] } })
  }, [value])

  return (
    <div className="col mt-2 gap-y-1">
      <div className="row justify-between items-center">
        <span className="textstyle-label-md">{translation.values}</span>
        <IconButton
          onClick={() => {
            onChange({ ...data }, { ...update, create: update.create + 1 })
          }}
          size="small"
        >
          <Plus className="w-full h-full"/>
        </IconButton>
      </div>
      <Scrollbars autoHide autoHeight autoHeightMax="24rem">
        <div className="col gap-y-2">
          {data.options.map((entry, index) => (
            <div key={index} className="row items-center justify-between gap-x-4">
              <Input
                value={entry.name ?? ''}
                placeholder={`${translation.newEntry} ${index + 1}`}
                onChangeText={text => {
                  const newList = [...data.options]
                  const newEntry = { ...entry, name: text }
                  newList[index] = newEntry
                  setState(
                    {
                      data: { ...data, options: newList },
                      update: { ...update, update: [...update.update, { ...newEntry, index }] }
                    }
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
              <TextButton
                color="negative"
                onClick={() => {
                  const newList = data.options.filter((_, index1) => index1 !== index)
                  onChange(
                    { ...data, options: newList },
                    { ...update, delete: [...update.delete, { id: entry.id, index }] }
                  )
                }}
              >
                <X size={20}/>
              </TextButton>
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

const defaultPropertyDetailsFieldTranslation: Translation<PropertyDetailsFieldTranslation> = {
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
  value: Property,
  onChange: (value: PropertyFieldDetails, update?: SelectDataUpdate) => void,
  expandableProps?: Omit<ExpandableProps, 'label'>,
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsField = ({
                                       overwriteTranslation,
                                       value,
                                       onChange,
                                       expandableProps
                                     }: PropsForTranslation<PropertyDetailsFieldTranslation, PropertyDetailsFieldProps>) => {
  const translation = useTranslation(defaultPropertyDetailsFieldTranslation, overwriteTranslation)
  const [usedValue, setUsedValue] = useState<PropertyFieldDetails>(value)
  const isSelectType = value.fieldType === 'multiSelect' || value.fieldType === 'singleSelect'

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <Expandable {...expandableProps} label={translation.field}>
      <Select
        // TODO add icons
        value={usedValue.fieldType}
        label={{ name: translation.fieldType, labelType: 'labelMedium' }}
        options={fieldTypeList.map(fieldType => ({ value: fieldType, label: translation[fieldType] }))}
        onChange={fieldType => {
          const newValue = { ...usedValue, fieldType }
          onChange(newValue)
        }}
        isDisabled={!!value.id}
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
                const newValue: PropertyFieldDetails = {
                  ...value,
                  selectData: { ...usedValue.selectData!, isAllowingFreetext }
                }
                onChange(newValue)
              }}
            />
          )}
          className="mt-4"
        />
      )}
    </Expandable>
  )
}
