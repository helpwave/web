import type { PropsForTranslation, Translation } from '@helpwave/hightide'
import { FillerRowElement } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  SolidButton,
  Table,
  TextButton,
  Tile,
  useTranslation
} from '@helpwave/hightide'
import { useContext, useEffect, useMemo } from 'react'
import { Plus, Tag } from 'lucide-react'
import type { FieldType, Property, SubjectType } from '@helpwave/api-services/types/properties/property'
import { usePropertyListQuery } from '@helpwave/api-services/mutations/properties/property_mutations'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { PropertyContext } from '@/pages/properties'
import { SubjectTypeIcon } from '@/components/layout/property/SubjectTypeIcon'
import { ColumnTitle } from '@/components/ColumnTitle'
import type { ColumnDef } from '@tanstack/react-table'

type PropertyDisplayTranslation = {
  properties: string,
  addProperty: string,
  subjectType: string,
  removeFilter: string,
  search: string,
  edit: string,
  name: string,
} & { [key in SubjectType | FieldType]: string }

const defaultPropertyDisplayTranslation: Translation<PropertyDisplayTranslation> = {
  en: {
    properties: 'Properties',
    addProperty: 'Add Property',
    subjectType: 'Subjekt Typ',
    removeFilter: 'Remove Filter',
    search: 'Search',
    edit: 'Edit',
    name: 'Name',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Number',
    text: 'Text',
    date: 'Date',
    dateTime: 'Date and Time',
    checkbox: 'Checkbox',
    patient: 'Patient',
    task: 'Task'
  },
  de: {
    properties: 'Eigenschaften',
    addProperty: 'Hinzufügen',
    subjectType: 'Subjekt Typ', // TODO better translation
    removeFilter: 'Filter entfernen',
    search: 'Suche',
    edit: 'Ändern',
    name: 'Name',
    multiSelect: 'Multi Select',
    singleSelect: 'Single Select',
    number: 'Zahl',
    text: 'Text',
    date: 'Datum',
    dateTime: 'Datum und Zeit',
    checkbox: 'Checkbox',
    patient: 'Patient',
    task: 'Task'
  }
}

export type PropertyDisplayProps = object

/**
 * A component for showing and changing properties Details
 */
export const PropertyDisplay = ({
                                  overwriteTranslation,
                                }: PropsForTranslation<PropertyDisplayTranslation, PropertyDisplayProps>) => {
  const translation = useTranslation([defaultPropertyDisplayTranslation], overwriteTranslation)

  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  // TODO replace with backend request
  const { data: propertyList, isLoading, isError, refetch } = usePropertyListQuery(contextState.subjectType)
  const { observeAttribute } = useUpdates()

  const filteredProperties: Property[] = propertyList ?? []

  useEffect(() => {
    const subscription = observeAttribute('aggregateType', 'property').subscribe(() => refetch())
    return () => {
      subscription.unsubscribe()
    }
  })

  const columns = useMemo<ColumnDef<Property>[]>(() => [
    {
      id: 'name',
      header: translation('name'),
      cell: ({ cell } ) => {
        if(!propertyList) {
          return
        }
        const value = propertyList[cell.row.index]!
        return (
          <Tile
            title={{ value: value.name }}
            description={{ value: translation(value.fieldType) }}
          />
        )
      },
      accessorKey: 'name',
      sortingFn: 'text',
      minSize: 160,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'subjectType',
      header: translation('subjectType'),
      cell: ({ cell } ) => {
        if(!propertyList) {
          return
        }
        const value = propertyList[cell.row.index]!
        return (
          <div className="row gap-x-2">
            <SubjectTypeIcon subjectType={value.subjectType}/>
            <span>{translation(value.subjectType)}</span>
          </div>
)
      },
      accessorFn: (property) => property.subjectType,
      minSize: 160,
      maxSize: 230,
      sortingFn: 'text',
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        if(!propertyList) {
          return
        }
        const value = propertyList[cell.row.index]!
        return (
          <div key="edit-button-cell" className="row justify-end">
            <TextButton onClick={() => updateContext({ ...contextState, propertyId: value.id })} color="primary">
              {translation('edit')}
            </TextButton>
          </div>
        )
      },
      minSize: 120,
      maxSize: 120,
      enableResizing: false,
    }
  ], [contextState, propertyList, translation, updateContext])

  return (
    <div className="py-4 px-6 col gap-y-4">
      <ColumnTitle
        title={(
          <div className="row gap-x-2 items-center">
            <Tag className="text-primary" size={20}/>
            <span>{translation('properties')}</span>
          </div>
        )}
        actions={(
          <SolidButton onClick={() => updateContext({
            ...contextState,
            propertyId: undefined
          })}>
            <div className="row gap-x-2 items-center">
              <Plus/>
              <span>{translation('addProperty')}</span>
            </div>
          </SolidButton>
        )}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: 'min-h-[300px] border-2 border-black rounded-xl' }}
      >
        <Table
          data={filteredProperties}
          columns={columns}
          initialState={{ pagination: { pageSize: 9 } }}
          fillerRow={() => (<FillerRowElement className="h-14"/>)}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
