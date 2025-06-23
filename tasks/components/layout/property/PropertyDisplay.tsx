import type { Translation } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { useContext, useEffect, useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { Input } from '@helpwave/hightide'
import { SolidButton, TextButton } from '@helpwave/hightide'
import { MultiSubjectSearchWithMapping } from '@helpwave/hightide'
import { Table } from '@helpwave/hightide'
import { Tile } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
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

export type PropertyDisplayProps = {
  searchValue?: string,
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
    <div className="py-4 px-6 col gap-y-4">
      <div className="row gap-x-1 items-center">
        <Tag className="text-primary" size={20}/>
        <span className="textstyle-title-lg">{translation.properties}</span>
      </div>
      <div className="col gap-y-2">
        <div className="row justify-between items-center">
          <div className="row items-center gap-x-2">
            <Input
              // TODO Search Icon
              value={search}
              onChangeText={setSearch}
              onEditCompleted={setSearch}
              placeholder={translation.search}
            />
            <PropertySubjectTypeSelect
              className="w-full text-nowrap"
              value={contextState.subjectType}
              onChange={subjectType => updateContext({ ...contextState, subjectType })}
              hintText={translation.subjectType}
            />
            <TextButton
              className="w-full px-0"
              color="negative"
              onClick={() => {
                updateContext({ ...contextState, subjectType: undefined })
                setSearch('')
              }}
            >
              {translation.removeFilter}
            </TextButton>
          </div>
          <SolidButton onClick={() => updateContext({
            ...contextState,
            propertyId: undefined
          })}>
            <div className="row gap-x-2 items-center">
              <Plus/>
              <span>{translation.addProperty}</span>
            </div>
          </SolidButton>
        </div>
      </div>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: 'min-h-[300px] border-2 border-black rounded-xl' }}
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
            (<div key="subject-type-cell" className="row gap-x-2">
              <SubjectTypeIcon subjectType={property.subjectType}/>
              <span>{translation[property.subjectType]}</span>
            </div>),
            (<div key="edit-button-cell" className="row justify-end">
              <TextButton onClick={() => updateContext({ ...contextState, propertyId: property.id })}>
                <span>{translation.edit}</span>
              </TextButton>
            </div>)
          ]}
          header={[
            <span key="headerName" className="textstyle-table-header">{translation.name}</span>,
            <span key="headerSubjectType" className="textstyle-table-header">{translation.subjectType}</span>,
            <></>
          ]}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
