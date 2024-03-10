import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsRules } from '@/components/layout/property/PropertyDetailsRules'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import type { Property } from '@/components/layout/property/property'
import { emptyProperty } from '@/components/layout/property/property'
import { PropertyContext } from '@/pages/properties'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string,
  archivePropertyDialogTitle: string,
  archivePropertyDialogDescription: string,
  createProperty: string,
  back: string,
  next: string,
  confirm: string
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details',
    archiveProperty: 'Archive Property',
    archivePropertyDialogTitle: 'Archive Property?',
    archivePropertyDialogDescription: 'This will archive the property and it won\'t be shown anymore.', // TODO improve text
    createProperty: 'Create Property',
    back: 'Back',
    next: 'Next Step',
    confirm: 'Create'
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails', // TODO better translation
    archiveProperty: 'Eigenschaft archivieren',
    archivePropertyDialogTitle: 'Eigenschaft archivieren?',
    archivePropertyDialogDescription: 'Die Eigenschaft wird archiviert und ist danach nicht mehr sichtbar.', // TODO improve text
    createProperty: 'Eigenschaft Erstellen',
    back: 'Zurück',
    next: 'Nächster Schritt',
    confirm: 'Erstellen'
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

  const {
    state: contextState,
  } = useContext(PropertyContext)
  const isCreatingNewProperty = contextState.propertyId === undefined
  // TODO query for data
  const [value, setValue] = useState<Property>(emptyProperty)
  const [showArchiveConfirm, setArchiveConfirm] = useState<boolean>(false)
  const [step, setStep] = useState(0)

  return (
    <div className={tw('py-4 px-6 flex flex-col gap-y-4 bg-gray-100 min-h-full')}>
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
      <PropertyDetailsBasicInfo
        value={value.basicInfo}
        onChange={basicInfo => setValue({
          ...value,
          basicInfo
        })}
        inputGroupProps={{
          expanded: !isCreatingNewProperty || step === 0 || step === 3,
          onChange: expanded => {
            if (expanded && isCreatingNewProperty && step !== 3) {
              setStep(0)
            }
          },
          className: tx({ 'opacity-60': isCreatingNewProperty && step !== 0 && step !== 3 })
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
          onChange: expanded => {
            if (expanded && isCreatingNewProperty && step !== 3) {
              setStep(1)
            }
          },
          className: tx({ 'opacity-60': isCreatingNewProperty && step !== 1 && step !== 3 })
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
          onChange: expanded => {
            if (expanded && isCreatingNewProperty && step !== 3) {
              setStep(2)
            }
          },
          className: tx({ 'opacity-60': isCreatingNewProperty && step !== 2 && step !== 3 })
        }}
      />
      <div className={tw('flex grow')}></div>
      {isCreatingNewProperty && (
        <>
          <div
            className={tw('sticky bottom-4 right-6 left-6 p-2 flex border-2 flex-row justify-between bg-white rounded-lg shadow-lg')}>
            <Button disabled={step === 0} onClick={() => setStep(step => step - 1)} variant="tertiary">
              <div className={tw('flex flex-row gap-x-1 items-center')}>
                <ChevronLeft size={14}/>
                {translation.back}
              </div>
            </Button>
            {step !== 3 && (
              <Button onClick={() => setStep(step => step + 1)}>
                <div className={tw('flex flex-row gap-x-1 items-center')}>
                  {translation.next}
                  <ChevronRight size={14}/>
                </div>
              </Button>
            )}
            {step === 3 && (
              <Button
                // TODO check form validity
                disabled={false}
                onClick={() => {
                  // TODO API call for create
                  console.log(value)
                }}
              >
                <div className={tw('flex flex-row gap-x-1 items-center')}>
                  <Check size={14}/>
                  {translation.confirm}
                </div>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
