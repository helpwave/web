import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Button } from '@helpwave/common/components/Button'
import { MultiSubjectSearchWithMapping } from '@helpwave/common/util/simpleSearch'
import { Table } from '@helpwave/common/components/Table'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { FieldType, Property, SubjectType } from '@helpwave/api-services/types/properties/property'
import { usePropertyListQuery } from '@helpwave/api-services/mutations/properties/property_mutations'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { PropertySubjectTypeSelect } from '@/components/layout/property/PropertySubjectTypeSelect'
import { PropertyContext } from '@/pages/properties'
import { SubjectTypeIcon } from '@/components/layout/property/SubjectTypeIcon'

type PropertyDisplayTranslation = {
  properties: string,
  addProperty: string,
  subjectType: string,
  removeFilter: string,
  search: string,
  edit: string,
  name: string
} & { [key in SubjectType | FieldType]: string }

const defaultPropertyDisplayTranslation: Record<Languages, PropertyDisplayTranslation> = {
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

export type PropertyDisplayProps = {
  searchValue?: string
}

/**
 * A component for showing and changing properties Details
 */
export const PropertyDisplay = ({
  overwriteTranslation,
  searchValue: initialSearchValue = '',
}: PropsForTranslation<PropertyDisplayTranslation, PropertyDisplayProps>) => {
  const translation = useTranslation(defaultPropertyDisplayTranslation, overwriteTranslation)

  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  // TODO replace with backend request
  const { data: propertyList, isLoading, isError, refetch } = usePropertyListQuery(contextState.subjectType)
  const [search, setSearch] = useState<string>(initialSearchValue)
  const { observeAttribute } = useUpdates()

  // TODO could be computationally intensive consider forwarding to the backend later on
  const filteredProperties: Property[] = propertyList ? MultiSubjectSearchWithMapping([contextState.subjectType ?? '', search], propertyList,
    property => [property.name, property.description, property.subjectType]) : []

  useEffect(() => {
    const subscription = observeAttribute('aggregateType', 'property').subscribe(() => refetch())
    return () => {
      subscription.unsubscribe()
    }
  })

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4')}>
      <div className={tw('flex flex-row gap-x-1 items-center')}>
        <Tag className={tw('text-hw-primary-400')} size={20}/>
        <span className={tw('textstyle-title-lg')}>{translation.properties}</span>
      </div>
      <div className={tw('flex flex-col gap-y-2')}>
        <div className={tw('flex flex-row justify-between')}>
          <div className={tw('flex flex-row gap-x-2')}>
            <Input
              // TODO Search Icon
              value={search}
              onChange={setSearch}
              onEditCompleted={setSearch}
              placeholder={translation.search}
            />
            <PropertySubjectTypeSelect
              className={tw('w-full')}
              value={contextState.subjectType}
              onChange={subjectType => updateContext({ ...contextState, subjectType })}
              hintText={translation.subjectType}
            />
            <Button
              className={tw('w-full !px-0')}
              variant="text"
              color="hw-negative"
              onClick={() => {
                updateContext({ ...contextState, subjectType: undefined })
                setSearch('')
              }}
            >
              {translation.removeFilter}
            </Button>
          </div>
          <Button onClick={() => updateContext({
            ...contextState,
            propertyId: undefined
          })}>
            <div className={tw('flex flex-row gap-x-2 items-center')}>
              <Plus/>
              <span>{translation.addProperty}</span>
            </div>
          </Button>
        </div>
      </div>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: tw('min-h-[300px] border-2 border-black rounded-xl') }}
      >
        <Table
          data={filteredProperties}
          identifierMapping={dataObject => dataObject.id}
          rowMappingToCells={property => [
            (<Tile
              key="field-type-cell"
              title={{ value: property.name }}
              description={{ value: translation[property.fieldType] }}
            />),
            (<div key="subject-type-cell" className={tw('flex flex-row gap-x-2')}>
              <SubjectTypeIcon subjectType={property.subjectType}/>
              <span>{translation[property.subjectType]}</span>
            </div>),
            (<div key="edit-button-cell" className={tw('flex flex-row justify-end')}>
              <Button variant="text" onClick={() => updateContext({ ...contextState, propertyId: property.id })}>
                <span>{translation.edit}</span>
              </Button>
            </div>)
          ]}
          header={[
            <span key="headerName" className={tw('textstyle-table-header')}>{translation.name}</span>,
            <span key="headerSubjectType" className={tw('textstyle-table-header')}>{translation.subjectType}</span>,
            <></>
          ]}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
