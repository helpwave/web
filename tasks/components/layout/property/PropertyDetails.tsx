import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsRules } from '@/components/layout/property/PropertyDetailsRules'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import type { Property } from '@/components/layout/property/property'
import { emptyProperty } from '@/components/layout/property/property'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details',
    archiveProperty: 'Archive Property'
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails', // TODO better translation
    archiveProperty: 'Eigenschaft archivieren'
  }
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
  const [value, setValue] = useState<Property>(emptyProperty)

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4 bg-gray-100 h-fit min-h-full')}>
      <div className={tw('flex flex-row justify-between items-center')}>
        <Span type="title">{translation.propertyDetails}</Span>
        <Button
          variant="textButton"
          color="negative"
          onClick={() => {
            // TODO do archive here
          }}
        >
          {translation.archiveProperty}
        </Button>
      </div>
      <PropertyDetailsBasicInfo
        value={value.basicInfo}
        onChange={basicInfo => setValue({
          ...value,
          basicInfo
        })}
      />
      <PropertyDetailsField
        value={value.field}
        onChange={field => setValue({
          ...value,
          field
        })}
      />
      <PropertyDetailsRules
        value={value.rules}
        onChange={rules => setValue({
          ...value,
          rules
        })}
      />
    </div>
  )
}
