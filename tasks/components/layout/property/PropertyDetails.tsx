import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { StepperInformation } from '@helpwave/common/components/StepperBar'
import { StepperBar } from '@helpwave/common/components/StepperBar'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsRules } from '@/components/layout/property/PropertyDetailsRules'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import type { IdentifiedProperty } from '@/components/layout/property/property'
import { emptyProperty } from '@/components/layout/property/property'
import { PropertyContext } from '@/pages/properties'
import {
  usePropertyArchiveMutation,
  usePropertyCreateMutation,
  usePropertyQuery
} from '@/mutations/property_mutations'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string,
  archivePropertyDialogTitle: string,
  archivePropertyDialogDescription: string,
  createProperty: string
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details',
    archiveProperty: 'Archive Property',
    archivePropertyDialogTitle: 'Archive Property?',
    archivePropertyDialogDescription: 'This will archive the property and it won\'t be shown anymore.', // TODO improve text
    createProperty: 'Create Property',
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails', // TODO better translation
    archiveProperty: 'Eigenschaft archivieren',
    archivePropertyDialogTitle: 'Eigenschaft archivieren?',
    archivePropertyDialogDescription: 'Die Eigenschaft wird archiviert und ist danach nicht mehr sichtbar.', // TODO improve text
    createProperty: 'Eigenschaft Erstellen',
  }
}

export type PropertyDetailsProps = NonNullable<unknown>

/**
 * A component for showing and changing property Details
 */
export const PropertyDetails = ({
  overwriteTranslation,
}: PropsForTranslation<PropertyDetailsTranslation, PropertyDetailsProps>) => {
  const translation = useTranslation(defaultPropertyDetailsTranslation, overwriteTranslation)

  const [showArchiveConfirm, setArchiveConfirm] = useState<boolean>(false)
  const [stepper, setStepper] = useState<StepperInformation>({
    step: 0,
    lastStep: 3,
    seenSteps: new Set([0])
  })
  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  const isCreatingNewProperty = !contextState.propertyId

  const { data, isError, isLoading } = usePropertyQuery(contextState.propertyId, 'patient')
  const [value, setValue] = useState<IdentifiedProperty>({
    id: '',
    ...emptyProperty,
    basicInfo: {
      ...emptyProperty.basicInfo,
      subjectType: contextState.subjectType ?? emptyProperty.basicInfo.subjectType
    }
  })
  const propertyCreateMutation = usePropertyCreateMutation(property => {
    updateContext({ ...contextState, propertyId: property.id })
  })
  const archivePropertyMutation = usePropertyArchiveMutation(() => {
    setArchiveConfirm(false)
    updateContext({ ...contextState, propertyId: undefined })
  })

  useEffect(() => {
    if (data && !isCreatingNewProperty) {
      setValue(data)
    }
  }, [data, isCreatingNewProperty])

  const { step } = stepper

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4 bg-gray-100 min-h-full')}>
      <ConfirmDialog
        id="confirmArchiveModal"
        isOpen={showArchiveConfirm}
        titleText={translation.archivePropertyDialogTitle}
        descriptionText={translation.archivePropertyDialogDescription}
        onCancel={() => setArchiveConfirm(false)}
        onConfirm={() => {
          archivePropertyMutation.mutate(value)
        }}
        onCloseClick={() => setArchiveConfirm(false)}
        onBackgroundClick={() => setArchiveConfirm(false)}
        confirmType="negative"
      />
      <div className={tw('top-0 flex flex-row justify-between items-center')}>
        <Span type="heading">{isCreatingNewProperty ? translation.createProperty : translation.propertyDetails}</Span>
        {!isCreatingNewProperty && (
          <Button
            variant="textButton"
            color="negative"
            onClick={() => setArchiveConfirm(true)}
          >
            {translation.archiveProperty}
          </Button>
        )}
      </div>
      <LoadingAndErrorComponent
        isLoading={!isCreatingNewProperty && isLoading}
        hasError={!isCreatingNewProperty && isError}
        loadingProps={{ classname: 'min-h-[400px] border-2 border-black rounded-xl' }}
      >
        <PropertyDetailsBasicInfo
          value={value.basicInfo}
          onChange={basicInfo => setValue({
            ...value,
            basicInfo
          })}
          inputGroupProps={{
            expanded: !isCreatingNewProperty || step === 0 || step === 3,
            isExpandable: !isCreatingNewProperty,
            disabled: isCreatingNewProperty && step !== 0 && step !== 3
          }}
        />
        <PropertyDetailsField
          value={value.field}
          onChange={field => setValue({
            ...value,
            field
          })}
          inputGroupProps={{
            expanded: !isCreatingNewProperty || step === 1 || step === 3,
            isExpandable: !isCreatingNewProperty,
            disabled: isCreatingNewProperty && step !== 1 && step !== 3
          }}
        />
        <PropertyDetailsRules
          value={value.rules}
          onChange={rules => setValue({
            ...value,
            rules
          })}
          inputGroupProps={{
            expanded: !isCreatingNewProperty || step === 2 || step === 3,
            isExpandable: !isCreatingNewProperty,
            disabled: isCreatingNewProperty && step !== 2 && step !== 3
          }}
        />
        <div className={tw('flex grow')}></div>
        {isCreatingNewProperty && (
          <StepperBar
            stepper={stepper}
            onChange={setStepper}
            onFinish={() => {
              propertyCreateMutation.mutate(value)
            }}
            className={tw('sticky bottom-4 right-6 left-6 bg-white')}
          />
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
