import { useState } from 'react'
import clsx from 'clsx'
import type { ConfirmDialogProps, Translation } from '@helpwave/hightide'
import {
  ConfirmDialog,
  FormElementWrapper,
  InputUncontrolled,
  type PropsForTranslation,
  useTranslation
} from '@helpwave/hightide'
import type { RoomBedSelectionValue } from '@/components/selects/RoomBedSelect'
import { RoomBedSelect } from '@/components/selects/RoomBedSelect'

type AddPatientModalTranslation = {
  addPatient: string,
  name: string,
  minimumLength: string,
  noBedSelected: string,
}

const defaultAddPatientModalTranslation: Translation<AddPatientModalTranslation> = {
  en: {
    addPatient: 'Add Patient',
    name: 'Name',
    minimumLength: `The Name must be at least {{characters}} characters long`,
    noBedSelected: 'No bed selected, the patient won\'t be assigned directly',
  },
  de: {
    addPatient: 'Patient Hinzufügen',
    name: 'Name',
    minimumLength: `Der Name muss mindestens {{characters}} characters lang sein`,
    noBedSelected: 'Kein Bett ausgewählt, der Patient wird nicht direkt zugeordnet'
  }
}

export type AddPatientModalValue = RoomBedSelectionValue & {
  name: string,
}

export type AddPatientModalProps = Omit<ConfirmDialogProps, 'titleElement' | 'description'> & {
  wardId: string,
  value: AddPatientModalValue,
  onValueChange: (value: AddPatientModalValue) => void,
}

/**
 * A Modal for adding a Patient
 */
export const AddPatientModal = ({
                                  overwriteTranslation,
                                  wardId,
                                  value,
                                  onValueChange,
                                  ...modalProps
                                }: PropsForTranslation<AddPatientModalTranslation, AddPatientModalProps>) => {
  const translation = useTranslation([defaultAddPatientModalTranslation], overwriteTranslation)
  const [touched, setTouched] = useState<boolean>(false)
  const { name, roomId, bedId } = value

  const minimumNameLength = 4
  const trimmedPatientName = name.trim()
  const validPatientName = trimmedPatientName.length >= minimumNameLength
  const validRoomAndBed = roomId && bedId
  const isShowingError = touched && !validPatientName

  return (
    <ConfirmDialog
      buttonOverwrites={[{}, {}, { disabled: !validPatientName }]}
      {...modalProps}
      titleElement={translation('addPatient')}
      description={undefined}
    >
      <div className="col gap-y-4 min-w-[300px]">
        <div className="col gap-y-1">
          <FormElementWrapper
            required={true}
            label={translation('name')}
            error={isShowingError ? translation('minimumLength', { replacements: { characters: minimumNameLength.toString() } }) : undefined}
            isShowingError={touched}
          >
            {({ isShowingError: _, setIsShowingError: _2, ...bag }) => (
              <InputUncontrolled
                value={name}
                onEditCompleted={name => {
                  setTouched(true)
                  onValueChange({ ...value, name })
                }}
                className="max-w-72"
                {...bag}
              />
            )}
          </FormElementWrapper>
        </div>
        <RoomBedSelect
          initialRoomAndBed={{ roomId, bedId }}
          wardId={wardId}
          onChange={(roomBedDropdownIds) => onValueChange({ ...roomBedDropdownIds, name })}
          isClearable={true}
        />
        <span
          className={clsx({
            'text-warning': !validRoomAndBed,
            'text-transparent': validRoomAndBed
          })}
        >
          {translation('noBedSelected')}
        </span>
      </div>
    </ConfirmDialog>
  )
}
