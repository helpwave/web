import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Tile } from '@helpwave/common/components/layout/Tile'
import { Plus, Tag } from 'lucide-react'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Span } from '@helpwave/common/components/Span'
import { Menu, MenuItem } from '@helpwave/common/components/user-input/Menu'
import { useEffect, useState } from 'react'
import type { PropertyWithValue, SubjectType } from '@/components/layout/property/property'
import {
  usePropertyListQuery, usePropertyWithValueCreateMutation,
  usePropertyWithValueListQuery,
  usePropertyWithValueUpdateMutation
} from '@/mutations/property_mutations'
import { PropertyEntry } from '@/components/layout/property/PropertyEntry'

type PropertyListTranslation = {
  properties: string,
  addProperty: string
}

const defaultPropertyListTranslation: Record<Languages, PropertyListTranslation> = {
  en: {
    properties: 'Properties',
    addProperty: 'Add Property'
  },
  de: {
    properties: 'Eigenschaften',
    addProperty: 'Eigenschaft hinzufügen'
  }
}

export type PropertyListProps = {
  subjectID: string,
  subjectType: SubjectType
}

/**
 * A component for listing properties for a subject
 */
export const PropertyList = ({
  overwriteTranslation,
  subjectID,
  subjectType
}: PropsForTranslation<PropertyListTranslation, PropertyListProps>) => {
  const translation = useTranslation(defaultPropertyListTranslation, overwriteTranslation)
  const {
    data: propertyList,
    isLoading: isLoadingPropertyList,
    isError: isErrorPropertyList
  } = usePropertyListQuery(subjectType)

  const [properties, setProperties] = useState<PropertyWithValue[]>([])
  const { data, isLoading, isError } = usePropertyWithValueListQuery(subjectID, subjectType)
  const updatePropertyMutation = usePropertyWithValueUpdateMutation()
  const createPropertyValue = usePropertyWithValueCreateMutation()

  useEffect(() => {
    if (data) {
      setProperties(data)
    }
  }, [data])

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading}
      hasError={isError}
      loadingProps={{ classname: 'min-h-[200px] border-2 border-black rounded-xl' }}
    >
      <div className={tw('flex flex-col gap-y-2')}>
        <Tile
          title={{ value: translation.properties, type: 'title' }}
          prefix={<Tag className={tw('text-hw-primary-400')} size={20}/>}
          className={tw('!gap-x-2')}
        />
        {properties && properties.map((property, index) => (
            <PropertyEntry
              key={index}
              property={property}
              onChange={value => setProperties(prevState => prevState
                .map(value1 => value1.id === value.id ? value : value1))}
              onEditComplete={value => updatePropertyMutation.mutate(value)}
            />
        )
        )}
        <Menu<HTMLDivElement> trigger={(onClick, ref) => (
          <div
            ref={ref}
            className={tw('flex flex-row px-4 py-2 gap-x-4 items-center border-2 border-dashed bg-gray-100 hover:border-hw-primary-400 rounded-2xl cursor-pointer')}
            onClick={onClick}
          >
            <Plus size={20}/>
            <Span>{translation.addProperty}</Span>
          </div>
        )}>
          <LoadingAndErrorComponent
            isLoading={isLoadingPropertyList}
            hasError={isErrorPropertyList}
          >
            {/* TODO searchbar here, possibly in a new component for list search */}
            {propertyList && properties && propertyList
              .filter(property => !properties.find(propertyWithValue => propertyWithValue.propertyId === property.id))
              .map(property => {
                return (
                  <MenuItem
                    key={property.id}
                    onClick={() => {
                      createPropertyValue.mutate({ ...property, propertyId: property.id, value: {}, id: subjectID })
                    }}>
                    {property.basicInfo.propertyName}
                  </MenuItem>
                )
              })}
          </LoadingAndErrorComponent>
        </Menu>
      </div>
    </LoadingAndErrorComponent>
  )
}
