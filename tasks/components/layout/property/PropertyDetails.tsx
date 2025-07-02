import type { PropsForTranslation, StepperState, Translation } from '@helpwave/hightide'
import { ConfirmModal, LoadingAndErrorComponent, range, StepperBar, TextButton, useTranslation } from '@helpwave/hightide'
import { useContext, useEffect, useState } from 'react'
import {
  usePropertyChangeSelectOptionMutation,
  usePropertyCreateMutation,
  usePropertyQuery,
  usePropertyUpdateMutation
} from '@helpwave/api-services/mutations/properties/property_mutations'
import type { Property, SelectData } from '@helpwave/api-services/types/properties/property'
import { emptyProperty, emptySelectData } from '@helpwave/api-services/types/properties/property'
import { PropertyDetailsBasicInfo } from '@/components/layout/property/PropertyDetailsBasicInfo'
import { PropertyDetailsField } from '@/components/layout/property/PropertyDetailsField'
import { PropertyContext } from '@/pages/properties'
import { ColumnTitle } from '@/components/ColumnTitle'

type PropertyDetailsTranslation = {
  propertyDetails: string,
  archiveProperty: string,
  archivePropertyDialogTitle: string,
  archivePropertyDialogDescription: string,
  createProperty: string,
  newEntry: string,
}

const defaultPropertyDetailsTranslation: Translation<PropertyDetailsTranslation> = {
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
  const translation = useTranslation([defaultPropertyDetailsTranslation], overwriteTranslation)

  const [showArchiveConfirm, setArchiveConfirm] = useState<boolean>(false)
  const lastStep = 2
  const [stepperState, setStepperState] = useState<StepperState>({
    currentStep: 0,
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

  const { currentStep: step } = stepperState

  return (
    <div className="py-4 px-6 col gap-y-4 min-h-full">
      <ConfirmModal
        headerProps={{
          titleText: translation('archivePropertyDialogTitle'),
          descriptionText: translation('archivePropertyDialogDescription')
        }}
        isOpen={showArchiveConfirm}
        onCancel={() => setArchiveConfirm(false)}
        onConfirm={() => {
          updatePropertyMutation.mutate({ ...value, isArchived: true })
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewProperty ? translation('createProperty') : translation('propertyDetails')}
        actions={!isCreatingNewProperty && (
          <TextButton color="negative" onClick={() => setArchiveConfirm(true)}>
            {translation('archiveProperty')}
          </TextButton>
        )}
      />
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
          expandableProps={{
            isExpanded: !isCreatingNewProperty || step === 0 || step === lastStep,
            disabled: isCreatingNewProperty && step !== 0 && step !== lastStep,
          }}
        />
        <PropertyDetailsField
          value={value}
          onChange={
            (fieldDetails, selectUpdate) => {
              const isSelect = fieldDetails.fieldType === 'singleSelect' || fieldDetails.fieldType === 'multiSelect'
              if (isCreatingNewProperty) {
                setValue(prevState => {
                  let selectData: SelectData | undefined = fieldDetails.selectData ? { ...fieldDetails.selectData } : undefined
                  if (isSelect) {
                    selectData ??= emptySelectData
                    if (selectUpdate) {
                      selectData.options.push(...range(0, selectUpdate.create - 1, true).map(index => ({
                        id: '',
                        name: `${translation('newEntry')} ${index + 1}`,
                        description: '',
                        isCustom: false
                      })))
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
                  add: range(0, selectUpdate.create - 1).map(index => ({
                    id: '',
                    name: `${translation('newEntry')} ${index + 1}`,
                    description: '',
                    isCustom: false
                  })),
                  remove: selectUpdate.delete.map(value1 => value1.id)
                })
              }
            }
          }
          expandableProps={{
            isExpanded: !isCreatingNewProperty || step === 1 || step === lastStep,
            disabled: isCreatingNewProperty && step !== 1 && step !== lastStep
          }}
        />
        <div className="grow"></div>
        {isCreatingNewProperty && (
          <StepperBar
            state={stepperState}
            disabledSteps={new Set<number>()}
            numberOfSteps={2}
            onChange={setStepperState}
            onFinish={() => {
              propertyCreateMutation.mutate(value)
            }}
            className="sticky bottom-4 right-6 left-6 p-2 rounded-xl shadow-around-lg bg-surface text-on-surface"
          />
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
