import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useState } from 'react'
import type {
  PropertyDetailsBasicInfoType
} from '@/components/layout/propertyDetails/PropertyDetailsBasicInfo'
import { PropertyDetailsBasicInfo } from '@/components/layout/propertyDetails/PropertyDetailsBasicInfo'
import type { PropertyDetailsRulesType } from '@/components/layout/propertyDetails/PropertyDetailsRules'
import { PropertyDetailsRules } from '@/components/layout/propertyDetails/PropertyDetailsRules'
import type { PropertyDetailsFieldType } from '@/components/layout/propertyDetails/PropertyDetailsField'
import { PropertyDetailsField } from '@/components/layout/propertyDetails/PropertyDetailsField'

type PropertyDetailsTranslation = {
  propertyDetails: string
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details'
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails' // TODO better translation
  }
}

export type PropertyDetailsType = {
  basicInfo: PropertyDetailsBasicInfoType,
  field:PropertyDetailsFieldType,
  rules: PropertyDetailsRulesType
}

const emptyPropertyDetails: PropertyDetailsType = {
  basicInfo: { propertyName: 'Name', subjectType: 'patient', description: '' },
  field: { fieldType: 'multiSelect', entryList: ['Test1', 'Test2', 'Test3'], isAllowingCustomValues: true },
  rules: { importance: 'optional', isAlwaysVisible: true }
}

export type PropertyDetailsProps = NonNullable<unknown>

/**
 * A component for showing and changing property Details
 */
export const PropertyDetails = ({
  language,
}: PropsWithLanguage<PropertyDetailsTranslation, PropertyDetailsProps>) => {
  const translation = useTranslation(language, defaultPropertyDetailsTranslation)

  /*
  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  const isCreatingNewProperty = contextState.propertyId === undefined
  TODO query for data
  */
  const [value, setValue] = useState<PropertyDetailsType>(emptyPropertyDetails)

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4 bg-gray-100 h-fit min-h-full')}>
      <Span type="title">{translation.propertyDetails}</Span>
      <PropertyDetailsBasicInfo
        value={value.basicInfo}
        onChange={basicInfo => setValue({ ...value, basicInfo })}
      />
      <PropertyDetailsField
        value={value.field}
        onChange={field => setValue({ ...value, field })}
      />
      <PropertyDetailsRules
        value={value.rules}
        onChange={rules => setValue({ ...value, rules })}
      />
    </div>
  )
}
