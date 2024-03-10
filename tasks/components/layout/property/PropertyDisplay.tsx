import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Button } from '@helpwave/common/components/Button'
import { MultiSubjectSearchWithMapping } from '@helpwave/common/util/simpleSearch'
import { Table } from '@helpwave/common/components/Table'
import { Tile } from '@helpwave/common/components/layout/Tile'
import type { SubjectType, IdentifiedProperty, FieldType } from '@/components/layout/property/property'
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
} & {[key in SubjectType|FieldType]: string}

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
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
    bed: 'Bett',
    patient: 'Patient',
  }
}

export type PropertyDisplayProps = {
  subjectType?: SubjectType,
  searchValue?: string
}

/**
 * A component for showing and changing property Details
 */
export const PropertyDisplay = ({
  language,
  searchValue: initialSearchValue = '',
  subjectType: initialSubjectType
}: PropsWithLanguage<PropertyDisplayTranslation, PropertyDisplayProps>) => {
  const translation = useTranslation(language, defaultPropertyDisplayTranslation)

  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  // TODO replace with backend request
  const propertyList: IdentifiedProperty[] = [
    {
      id: '1',
      basicInfo: {
        propertyName: 'Name 1',
        description: 'Description Text',
        subjectType: 'patient',
      },
      field: {
        fieldType: 'multiSelect',
        entryList: ['Apple', 'Banana', 'Lemon'],
        isAllowingCustomValues: false
      },
      rules: {
        importance: 'optional',
        isAlwaysVisible: true
      }
    },
    {
      id: '2',
      basicInfo: {
        propertyName: 'Name 2',
        description: 'Description Text',
        subjectType: 'patient',
      },
      field: {
        fieldType: 'number',
        entryList: ['Apple', 'Banana', 'Lemon'],
        isAllowingCustomValues: false
      },
      rules: {
        importance: 'optional',
        isAlwaysVisible: true
      }
    },
    {
      id: '3',
      basicInfo: {
        propertyName: 'Searchable Name 3',
        description: 'Description Text',
        subjectType: 'organization',
      },
      field: {
        fieldType: 'text',
        entryList: ['Apple', 'Banana', 'Lemon'],
        isAllowingCustomValues: false
      },
      rules: {
        importance: 'optional',
        isAlwaysVisible: true
      }
    },
    {
      id: '4',
      basicInfo: {
        propertyName: 'Name 4',
        description: 'Description Text',
        subjectType: 'ward',
      },
      field: {
        fieldType: 'date',
        entryList: ['Apple', 'Banana', 'Lemon'],
        isAllowingCustomValues: false
      },
      rules: {
        importance: 'optional',
        isAlwaysVisible: true
      }
    }
  ]
  const [subjectType, setSubjectType] = useState<SubjectType | undefined>(initialSubjectType)
  const [search, setSearch] = useState<string>(initialSearchValue)

  // TODO could be computationally intensive consider forwarding to the backend later on
  const filteredProperties = MultiSubjectSearchWithMapping([subjectType ?? '', search], propertyList,
    property => [property.basicInfo.propertyName, property.basicInfo.description, property.basicInfo.subjectType])

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
              value={subjectType}
              onChange={setSubjectType}
              hintText={translation.subjectType}
            />
            <Button
              className={tw('w-full !px-0')}
              variant="textButton"
              color="negative"
              onClick={() => {
                setSubjectType(undefined)
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
              <Button variant="textButton">
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
    </div>
  )
}
