import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Button } from '@helpwave/common/components/Button'
import { MultiSubjectSearchWithMapping } from '@helpwave/common/util/simpleSearch'
import { Table } from '@helpwave/common/components/Table'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { SubjectType, FieldType } from '@/components/layout/property/property'
import { PropertySubjectTypeSelect } from '@/components/layout/property/PropertySubjectTypeSelect'
import { PropertyContext } from '@/pages/properties'
import { SubjectTypeIcon } from '@/components/layout/property/SubjectTypeIcon'
import { usePropertyListQuery } from '@/mutations/property_mutations'

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
    checkbox: 'Checkbox',
    organization: 'Organization',
    ward: 'Ward',
    room: 'Room',
    bed: 'Bed',
    patient: 'Patient',
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
    checkbox: 'Checkbox',
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
    bed: 'Bett',
    patient: 'Patient',
  }
}

export type PropertyDisplayProps = {
  searchValue?: string
}

/**
 * A component for showing and changing property Details
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
  const { data: propertyList, isLoading, isError } = usePropertyListQuery(contextState.subjectType)
  const [search, setSearch] = useState<string>(initialSearchValue)

  // TODO could be computationally intensive consider forwarding to the backend later on
  const filteredProperties = propertyList ? MultiSubjectSearchWithMapping([contextState.subjectType ?? '', search], propertyList,
    property => [property.basicInfo.propertyName, property.basicInfo.description, property.basicInfo.subjectType]) : []

  console.log(filteredProperties)

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4')}>
      <div className={tw('flex flex-row gap-x-1 items-center')}>
        <Tag className={tw('text-hw-primary-400')} size={20}/>
        <Span type="heading">{translation.properties}</Span>
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
              variant="textButton"
              color="negative"
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
              <Span>{translation.addProperty}</Span>
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
              title={{ value: property.basicInfo.propertyName }}
              description={{ value: translation[property.field.fieldType] }}
            />),
            (<div key="subject-type-cell" className={tw('flex flex-row gap-x-2')}>
              <SubjectTypeIcon subjectType={property.basicInfo.subjectType}/>
              <Span>{translation[property.basicInfo.subjectType]}</Span>
            </div>),
            (<div key="edit-button-cell" className={tw('flex flex-row justify-end')}>
              <Button variant="textButton" onClick={() => updateContext({ ...contextState, propertyId: property.id })}>
                <Span>{translation.edit}</Span>
              </Button>
            </div>)
          ]}
          header={[
            <Span key="headerName" type="tableHeader">{translation.name}</Span>,
            <Span key="headerSubjectType" type="tableHeader">{translation.subjectType}</Span>,
            <></>
          ]}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
