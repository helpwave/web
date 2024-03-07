import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { InputGroup } from '@helpwave/common/components/InputGroup'
import { Select } from '@helpwave/common/components/user-input/Select'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { Plus, X } from 'lucide-react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Input } from '@helpwave/common/components/user-input/Input'
import type { FieldType, PropertyFieldType } from '@/components/layout/property/property'
import { fieldTypeList } from '@/components/layout/property/property'

type PropertyDetailsFieldTranslation = {
  field: string,
  fieldType: string,
  values: string,
  allowCustomValues: string,
  allowCustomValuesDescription: string,
  newEntry: string
} & { [key in FieldType]: string }

const defaultPropertyDetailsFieldTranslation: Record<Languages, PropertyDetailsFieldTranslation> = {
  en: {
    field: 'Field',
    fieldType: 'Field Type',
    values: 'Values',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Number',
    text: 'Text',
    date: 'Date',
    allowCustomValues: 'Allow custom values',
    allowCustomValuesDescription: 'Let users enter a free text when the predefined values are not enough.',
    newEntry: 'New Entry'
  },
  de: {
    field: 'Property Eingabe', // TODO better translation
    fieldType: 'Property Typ',
    values: 'Werte',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Zahl',
    text: 'Text',
    date: 'Datum',
    allowCustomValues: 'Hinzufügen neuer Werte',
    allowCustomValuesDescription: 'Werte können neu hinzugefügt werden,wenn sie nicht vorhanden sind.',
    newEntry: 'Neuer Eintrag'
  }
}

export type PropertyDetailsFieldProps = {
  value: PropertyFieldType,
  onChange: (value: PropertyFieldType) => void
}

/**
 * The Layout for the PropertyDetails basic information input
 */
export const PropertyDetailsField = ({
  language,
  value,
  onChange
}: PropsWithLanguage<PropertyDetailsFieldTranslation, PropertyDetailsFieldProps>) => {
  const translation = useTranslation(language, defaultPropertyDetailsFieldTranslation)
  const isSelectType = value.fieldType === 'multiSelect' || value.fieldType === 'singleSelect'
  return (
    <InputGroup title={translation.field}>
      <Select
        // TODO add icons
        value={value.fieldType}
        label={{ name: translation.fieldType, labelType: 'labelMedium' }}
        options={fieldTypeList.map(fieldType => ({ value: fieldType, label: translation[fieldType] }))}
        onChange={fieldType => onChange({ ...value, fieldType })}
      />
      {isSelectType && (
        <div className={tw('flex flex-col mt-2 gap-y-1')}>
          <div className={tw('flex flex-row justify-between items-center')}>
            <Span type="labelMedium">{translation.values}</Span>
            <Plus
              className={tw('text-white bg-hw-primary-400 hover:text-gray-100 hover:bg-hw-primary-600 rounded-full mr-3')}
              size={20}
              onClick={() => {
                const newList = [...value.entryList]
                newList.push(translation.newEntry)
                onChange({ ...value, entryList: newList })
              }}
            />
          </div>
          <Scrollbars autoHide autoHeight autoHeightMax={400}>
            <div className={tw('flex flex-col gap-y-2 mr-3')}>
              {value.entryList.map((entry, index) => (
                <div key={index} className={tw('flex flex-row items-center justify-between gap-x-4')}>
                  <Input
                    value={entry}
                    onChange={text => {
                      const newList = [...value.entryList]
                      newList[index] = text
                      onChange({ ...value, entryList: newList })
                    }}
                    onEditCompleted={text => {
                      const newList = [...value.entryList]
                      newList[index] = text
                      onChange({ ...value, entryList: newList })
                    }}
                  />
                  <X
                    className={tw('text-hw-negative-400 hover:text-hw-negative-600')}
                    size={20}
                    onClick={() => {
                      const newList = value.entryList.filter((_, index1) => index1 !== index)
                      onChange({ ...value, entryList: newList })
                    }}
                  />
                </div>
              ))}
            </div>
          </Scrollbars>
        </div>
      )}
      {isSelectType && (
        <Tile
          title={{ value: translation.allowCustomValues, type: 'labelMedium' }}
          description={{ value: translation.allowCustomValuesDescription }}
          suffix={(
            <Checkbox
              checked={value.isAllowingCustomValues}
              onChange={isAllowingCustomValues => onChange({ ...value, isAllowingCustomValues })}
              size={20}
            />
          )}
          className={tw('mt-4')}
        />
      )}
    </InputGroup>
  )
}
