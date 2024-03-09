import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsRules } from '@/components/layout/property/PropertyDetailsRules'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import type { Property } from '@/components/layout/property/property'
import { emptyProperty } from '@/components/layout/property/property'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string,
  archivePropertyDialogTitle: string,
  archivePropertyDialogDescription: string
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details',
    archiveProperty: 'Archive Property',
    archivePropertyDialogTitle: 'Archive Property?',
    archivePropertyDialogDescription: 'This will archive the property and it won\'t be shown anymore.' // TODO improve text
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails', // TODO better translation
    archiveProperty: 'Eigenschaft archivieren',
    archivePropertyDialogTitle: 'Eigenschaft archivieren?',
    archivePropertyDialogDescription: 'Die Eigenschaft wird archiviert und ist danach nicht mehr sichtbar.' // TODO improve text
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
  const [showArchiveConfirm, setArchiveConfirm] = useState<boolean>(false)

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4 bg-gray-100 h-fit min-h-full')}>
      <ConfirmDialog
        id="confirmArchiveModal"
        isOpen={showArchiveConfirm}
        titleText={translation.archivePropertyDialogTitle}
        descriptionText={translation.archivePropertyDialogDescription}
        onCancel={() => setArchiveConfirm(false)}
        onConfirm={() => {
          // TODO do archive here
          setArchiveConfirm(false)
        }}
        onCloseClick={() => setArchiveConfirm(false)}
        onBackgroundClick={() => setArchiveConfirm(false)}
        confirmType="negative"
      />
      <div className={tw('flex flex-row justify-between items-center')}>
        <Span type="title">{translation.propertyDetails}</Span>
        <Button
          variant="textButton"
          color="negative"
          onClick={() => setArchiveConfirm(true)}
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
