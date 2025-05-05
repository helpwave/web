import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { SolidButton } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { StepperInformation } from '@helpwave/common/components/StepperBar'
import { StepperBar } from '@helpwave/common/components/StepperBar'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import {
  usePropertyChangeSelectOptionMutation,
  usePropertyCreateMutation,
  usePropertyQuery,
  usePropertyUpdateMutation
} from '@helpwave/api-services/mutations/properties/property_mutations'
import type { Property, SelectData } from '@helpwave/api-services/types/properties/property'
import { emptyProperty, emptySelectData } from '@helpwave/api-services/types/properties/property'
import { range } from '@helpwave/common/util/array'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import { PropertyContext } from '@/pages/properties'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string,
  archivePropertyDialogTitle: string,
  archivePropertyDialogDescription: string,
  createProperty: string,
  newEntry: string,
}

const defaultPropertyDetailsTranslation: Record<Languages, PropertyDetailsTranslation> = {
  en: {
    propertyDetails: 'Property Details',
    archiveProperty: 'Archive Property',
    archivePropertyDialogTitle: 'Archive Property?',
    archivePropertyDialogDescription: 'This will archive the properties and it won\'t be shown anymore.', // TODO improve text
    createProperty: 'Create Property',
    newEntry: 'New Entry',
  },
  de: {
    propertyDetails: 'Eigenschaftsdetails', // TODO better translation
    archiveProperty: 'Eigenschaft archivieren',
    archivePropertyDialogTitle: 'Eigenschaft archivieren?',
    archivePropertyDialogDescription: 'Die Eigenschaft wird archiviert und ist danach nicht mehr sichtbar.', // TODO improve text
    createProperty: 'Eigenschaft Erstellen',
    newEntry: 'Neuer Eintrag',
  }
}

export type PropertyDetailsProps = NonNullable<unknown>

/**
 * A component for showing and changing properties Details
 */
export const PropertyDetails = ({
  overwriteTranslation,
}: PropsForTranslation<PropertyDetailsTranslation, PropertyDetailsProps>) => {
  const translation = useTranslation(defaultPropertyDetailsTranslation, overwriteTranslation)

  const [showArchiveConfirm, setArchiveConfirm] = useState<boolean>(false)
  const lastStep = 2
  const [stepper, setStepper] = useState<StepperInformation>({
    step: 0,
    lastStep,
    seenSteps: new Set([0])
  })
  const {
    state: contextState,
    updateContext
  } = useContext(PropertyContext)
  const isCreatingNewProperty = !contextState.propertyId

  const { data, isError, isLoading } = usePropertyQuery(contextState.propertyId)
  const updatePropertyMutation = usePropertyUpdateMutation()
  const updateSelectDataMutation = usePropertyChangeSelectOptionMutation()
  const [value, setValue] = useState<Property>({
    ...emptyProperty,
  })
  const propertyCreateMutation = usePropertyCreateMutation(property => {
    updateContext({ ...contextState, propertyId: property.id })
  })

  useEffect(() => {
    if (data && !isCreatingNewProperty) {
      setValue(data)
    }
  }, [data, isCreatingNewProperty])

  const { step } = stepper

  return (
    <div className={clsx('py-4 px-6 col gap-y-4 bg-gray-100 min-h-full')}>
      <ConfirmDialog
        id="confirmArchiveModal"
        isOpen={showArchiveConfirm}
        titleText={translation.archivePropertyDialogTitle}
        descriptionText={translation.archivePropertyDialogDescription}
        onCancel={() => setArchiveConfirm(false)}
        onConfirm={() => {
          updatePropertyMutation.mutate({ ...value, isArchived: true })
        }}
        onCloseClick={() => setArchiveConfirm(false)}
        onBackgroundClick={() => setArchiveConfirm(false)}
        confirmType="negative"
      />
      <div className={clsx('top-0 row justify-between items-center')}>
        <span className={clsx('textstyle-title-lg')}>{isCreatingNewProperty ? translation.createProperty : translation.propertyDetails}</span>
        {!isCreatingNewProperty && (
          <SolidButton
            variant="text"
            color="negative"
            onClick={() => setArchiveConfirm(true)}
          >
            {translation.archiveProperty}
          </SolidButton>
        )}
      </div>
      <LoadingAndErrorComponent
        isLoading={!isCreatingNewProperty && isLoading}
        hasError={!isCreatingNewProperty && isError}
        loadingProps={{ classname: 'min-h-[400px] border-2 border-black rounded-xl' }}
      >
        <PropertyDetailsBasicInfo
          value={value}
          onChange={basicInfo => setValue({
            ...value,
            ...basicInfo
          })}
          onEditComplete={
            basicInfo => {
              if (isCreatingNewProperty) {
                setValue({
                  ...value,
                  ...basicInfo
                })
                return
              }
              updatePropertyMutation.mutate({
                ...value,
                ...basicInfo
              })
            }
          }
          inputGroupProps={{
            expanded: !isCreatingNewProperty || step === 0 || step === lastStep,
            isExpandable: !isCreatingNewProperty,
            disabled: isCreatingNewProperty && step !== 0 && step !== lastStep
          }}
        />
        <PropertyDetailsField
          value={value}
          onChange={
            (fieldDetails, selectUpdate) => {
              const isSelect = fieldDetails.fieldType === 'singleSelect' || fieldDetails.fieldType === 'multiSelect'
              if (isCreatingNewProperty) {
                setValue(prevState => {
                  let selectData : SelectData|undefined = fieldDetails.selectData ? { ...fieldDetails.selectData } : undefined
                  if (isSelect) {
                    selectData ??= emptySelectData
                    if (selectUpdate) {
                      selectData.options.push(...range(0, selectUpdate.create - 1, true).map(index => ({ id: '', name: `${translation.newEntry} ${index + 1}`, description: '', isCustom: false })))
                    }
                  }
                  return { ...prevState, fieldType: fieldDetails.fieldType, selectData }
                })
                return
              }

              // TODO combine these
              updatePropertyMutation.mutate({
                ...value,
                ...fieldDetails
              })
              if (selectUpdate) {
                updateSelectDataMutation.mutate({
                  propertyId: value.id,
                  update: selectUpdate.update,
                  add: range(0, selectUpdate.create - 1).map(index => ({ id: '', name: `${translation.newEntry} ${index + 1}`, description: '', isCustom: false })),
                  remove: selectUpdate.delete.map(value1 => value1.id)
                })
              }
            }
          }
          inputGroupProps={{
            expanded: !isCreatingNewProperty || step === 1 || step === lastStep,
            isExpandable: !isCreatingNewProperty,
            disabled: isCreatingNewProperty && step !== 1 && step !== lastStep
          }}
        />
        <div className={clsx('grow')}></div>
        {isCreatingNewProperty && (
          <StepperBar
            stepper={stepper}
            onChange={setStepper}
            onFinish={() => {
              propertyCreateMutation.mutate(value)
            }}
            className={clsx('sticky bottom-4 right-6 left-6 bg-white')}
          />
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
