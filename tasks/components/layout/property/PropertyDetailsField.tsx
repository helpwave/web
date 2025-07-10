import type { ExpandableProps, FormTranslationType, PropsForTranslation, Translation } from '@helpwave/hightide'
import {
  Checkbox,
  ExpandableUncontrolled,
  FillerRowElement,
  formTranslation,
  IconButton,
  InputUncontrolled,
  Select,
  SolidButton,
  TableWithSelection,
  Tile,
  useTranslation
} from '@helpwave/hightide'
import { Plus, X } from 'lucide-react'
import type { FieldType, Property, SelectData, SelectOption } from '@helpwave/api-services/types/properties/property'
import { fieldTypeList } from '@helpwave/api-services/types/properties/property'
import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { ColumnTitle } from '@/components/ColumnTitle'

type SelectDataUpdate = {
  create: number,
  update: (SelectOption & { index: number })[],
  delete: { id: string, index: number }[],
}

type PropertySelectOptionsUpdaterPropsTranslation = {
  newEntry: string,
  values: string,
}

type TranslationType = FormTranslationType & PropertySelectOptionsUpdaterPropsTranslation

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
                                             }: PropsForTranslation<TranslationType, PropertySelectOptionsUpdaterProps>) => {
  const translation = useTranslation([formTranslation, defaultPropertySelectOptionsUpdaterPropsTranslation], overwriteTranslation)
  const [state, setState] = useState<PropertySelectOptionsUpdaterState>({
    data: value,
    update: { create: 0, update: [], delete: [] }
  })
  const [selection, setSelection] = useState<RowSelectionState>({})

  const { data, update } = state

  useEffect(() => {
    setState({ data: value, update: { create: 0, update: [], delete: [] } })
    setSelection({})
  }, [value])

  const columns = useMemo<ColumnDef<SelectOption>[]>(() => [
    {
      id: 'value',
      header: translation('values'),
      cell: ({ cell }) => {
        const index = cell.row.index
        const entry = data.options[index]!
        return (
          <InputUncontrolled
            value={entry.name}
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
        )
      },
      accessorFn: (value) => value.name,
      sortingFn: 'text',
      minSize: 160,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        const index = cell.row.index
        const entry = data.options[index]!
        return (
          <IconButton
            color="transparent"
            onClick={() => {
              const newList = data.options.filter((_, index1) => index1 !== index)
              onChange(
                { ...data, options: newList },
                { ...update, delete: [...update.delete, { id: entry.id, index }] }
              )
            }}
          >
            <X size={20} className="text-negative"/>
          </IconButton>
        )
      },
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
    }
  ], [data, onChange, translation, update])

  const selectedIndexes = Object.keys(selection)

  return (
    <div className="col mt-2 gap-y-1">
      <ColumnTitle
        title={translation('values')}
        type="subtitle"
        actions={(
          <div className="row items-center gap-x-2">
            {selectedIndexes.length > 0 && (
              <SolidButton
                color="negative"
                size="small"
                onClick={() => {
                  const newList = data.options.filter((_, index) => !selectedIndexes.find(value1 => value1 === index.toString()))
                  onChange(
                    { ...data, options: newList },
                    {
                      ...update,
                      delete: [...update.delete, ...data.options
                        .map((option, index) => ({
                        ...option,
                        index
                      })).filter(value => !!selectedIndexes[value.index])
                        .map(value => ({
                        index: value.index,
                        id: value.id
                      }))]
                    }
                  )
                }}
              >
                {translation('delete')}
              </SolidButton>
            )}
            <IconButton
              onClick={() => {
                onChange({ ...data }, { ...update, create: update.create + 1 })
              }}
              size="small"
            >
              <Plus className="w-full h-full"/>
            </IconButton>
          </div>
        )}
      />
      <div className="row justify-between items-center">
        <span className="textstyle-label-md">{}</span>

      </div>
      <TableWithSelection
        columns={columns}
        data={data.options}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        disableClickRowClickSelection={true}
        initialState={{ pagination: { pageSize: 5 } }}
        fillerRow={() => (<FillerRowElement className="h-10"/>)}
      />
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
    field: 'Eingabe',
    fieldType: 'Eigenschaftstyp',
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
  const translation = useTranslation([defaultPropertyDetailsFieldTranslation], overwriteTranslation)
  const [usedValue, setUsedValue] = useState<PropertyFieldDetails>(value)
  const isSelectType = value.fieldType === 'multiSelect' || value.fieldType === 'singleSelect'

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <ExpandableUncontrolled
      {...expandableProps}
      label={(
        <h4 className="textstyle-title-sm">
          {translation('field')}
        </h4>
      )}
    >
      <Select
        // TODO add icons
        value={usedValue.fieldType}
        label={{ name: translation('fieldType'), labelType: 'labelMedium' }}
        options={fieldTypeList.map(fieldType => ({ value: fieldType, label: translation(fieldType) }))}
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
          title={{ value: translation('allowCustomValues'), className: 'textstyle-label-md' }}
          description={{ value: translation('allowCustomValuesDescription') }}
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
    </ExpandableUncontrolled>
  )
}
