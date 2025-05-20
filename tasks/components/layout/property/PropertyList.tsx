
import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Tile } from '@helpwave/hightide'
import { Plus, Tag } from 'lucide-react'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { Menu, MenuItem } from '@helpwave/hightide'
import { useEffect, useState } from 'react'
import { SearchableList } from '@helpwave/hightide'
import type { SubjectType } from '@helpwave/api-services/types/properties/property'
import {
  useAttachPropertyMutation,
  usePropertyWithValueListQuery
} from '@helpwave/api-services/mutations/properties/property_value_mutations'
import type {
  AttachedProperty,
  DisplayableAttachedProperty
} from '@helpwave/api-services/types/properties/attached_property'
import { usePropertyListQuery } from '@helpwave/api-services/mutations/properties/property_mutations'
import { emptyPropertyValue } from '@helpwave/api-services/types/properties/attached_property'
import {
  useUpdatePropertyViewRuleRequest
} from '@helpwave/api-services/mutations/properties/property_view_src_mutations'
import { PropertyEntry } from '@/components/layout/property/PropertyEntry'

type PropertyListTranslation = {
  properties: string,
  addProperty: string,
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
  subjectId: string,
  subjectType: SubjectType,
}

/**
 * A component for listing properties for a subject
 */
export const PropertyList = ({
  overwriteTranslation,
  subjectId,
  subjectType
}: PropsForTranslation<PropertyListTranslation, PropertyListProps>) => {
  const translation = useTranslation(defaultPropertyListTranslation, overwriteTranslation)
  const {
    data: propertyList,
    isLoading: isLoadingPropertyList,
    isError: isErrorPropertyList
  } = usePropertyListQuery(subjectType)

  const [properties, setProperties] = useState<DisplayableAttachedProperty[]>([])
  const { data, isLoading, isError } = usePropertyWithValueListQuery(subjectId, subjectType)
  const addOrUpdatePropertyMutation = useAttachPropertyMutation()
  const updateViewRulesMutation = useUpdatePropertyViewRuleRequest(subjectType)

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
      <div className="col gap-y-2">
        <Tile
          title={{ value: translation.properties, className: 'textstyle-title-lg' }}
          prefix={<Tag className="text-primary" size={20}/>}
          className="!gap-x-2"
        />
        {properties && properties.map((property, index) => (
            <PropertyEntry
              key={index}
              attachedProperty={property}
              onChange={value => setProperties(prevState => prevState
                .map(value1 => value1.propertyId === value.propertyId && value1.subjectId === value.subjectId ? { ...value1, ...value } : value1))}
              onEditComplete={value => addOrUpdatePropertyMutation.mutate({ previous: property, update: value, fieldType: property.fieldType })}
              onRemove={value => addOrUpdatePropertyMutation.mutate({ previous: property, update: value, fieldType: property.fieldType })}
            />
        ))}
        <Menu<HTMLDivElement>
          trigger={(onClick, ref) => (
            <div
              ref={ref}
              className="row px-4 py-2 gap-x-4 items-center border-2 border-dashed bg-gray-100 hover:border-primary rounded-2xl cursor-pointer"
              onClick={onClick}
            >
              <Plus size={20}/>
              <span>{translation.addProperty}</span>
            </div>
          )}
          menuClassName="min-w-[200px] p-2 "
          alignment="t_"
        >
          <LoadingAndErrorComponent
            isLoading={isLoadingPropertyList}
            hasError={isErrorPropertyList}
          >
            {/* TODO searchbar here, possibly in a new component for list search */}
            {propertyList && properties && (
              <SearchableList
                list={propertyList
                  .filter(property => !properties.find(propertyWithValue => propertyWithValue.propertyId === property.id))}
                searchMapping={value => [value.name]}
                itemMapper={property => (
                  <MenuItem
                    key={property.id}
                    onClick={() => {
                      const attachedProperty : AttachedProperty = { propertyId: property.id, subjectId, value: emptyPropertyValue }
                      addOrUpdatePropertyMutation.mutate({ previous: attachedProperty, update: attachedProperty, fieldType: property.fieldType })
                      updateViewRulesMutation.mutate({ subjectId, appendToAlwaysInclude: [property.id] })
                    }}
                    className="rounded-md cursor-pointer"
                  >
                    {property.name}
                  </MenuItem>
                )}
              />
            )}
          </LoadingAndErrorComponent>
        </Menu>
      </div>
    </LoadingAndErrorComponent>
  )
}
