import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { RoomBedDropDownIDs } from './RoomBedDropDown'
import { RoomBedDropDown } from './RoomBedDropDown'
import React, { useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user_input/Input'
import { noop } from '@helpwave/common/util/noop'
import { emptyPatient, useAssignBedMutation, usePatientCreateMutation } from '../mutations/patient_mutations'

type AddPatientModalTranslation = {
  addPatient: string,
  name: string,
  minimumLength: (characters: number) => string
}

const defaultAddPatientModalTranslation: Record<Languages, AddPatientModalTranslation> = {
  en: {
    addPatient: 'Add Patient',
    name: 'Name',
    minimumLength: (characters: number) => `The Name must be at least ${characters} characters long`
  },
  de: {
    addPatient: 'Patient Hinzufügen',
    name: 'Name',
    minimumLength: (characters: number) => `Der Name muss mindestens ${characters} characters lang sein`
  }
}

export type AddPatientModalProps = ConfirmDialogProps & {
  wardID: string
}

/**
 * Description
 */
export const AddPatientModal = ({
  language,
  wardID,
  title,
  onConfirm = noop,
  ...modalProps
}: PropsWithLanguage<AddPatientModalTranslation, AddPatientModalProps>) => {
  const translation = useTranslation(language, defaultAddPatientModalTranslation)
  const [dropdownID, setDropdownID] = useState<RoomBedDropDownIDs>({})
  const [patientName, setPatientName] = useState<string>('')
  const [touched, setTouched] = useState<boolean>(false)
  const assignBedMutation = useAssignBedMutation()
  const createPatientMutation = usePatientCreateMutation(patient => {
    if (dropdownID.bedID) {
      assignBedMutation.mutate({ id: dropdownID.bedID, patientID: patient.id })
    } else {
      // should not occur but just as a safety measurement
      console.error('AddPatientModal bedId not found')
    }
  })

  const minimumNameLength = 4
  const trimmedPatientName = patientName.trim()
  const validPatientName = trimmedPatientName.length >= minimumNameLength
  const isShowingError = touched && !validPatientName
  const isValid = validPatientName && !!dropdownID.roomID && !!dropdownID.bedID

  return (
    <ConfirmDialog
      title={title ?? translation.addPatient}
      onConfirm={() => {
        onConfirm()
        createPatientMutation.mutate({ ...emptyPatient, name: trimmedPatientName })
      }}
      buttonOverwrites={[{}, {}, { disabled: !isValid }]}
      {...modalProps}
    >
      <div className={tw('flex flex-col gap-y-4 min-w-[300px]')}>
        <div className={tw('flex flex-col gap-y-1')}>
          <Span type="labelMedium">{translation.name}</Span>
          <Input
            value={patientName}
            onChange={text => {
              setTouched(true)
              setPatientName(text)
            }}
          />
          {isShowingError && <Span type="formError">{translation.minimumLength(minimumNameLength)}</Span>}
        </div>
        <RoomBedDropDown
          initialRoomAndBed={dropdownID}
          wardID={wardID}
          onChange={roomBedDropDownIDs => setDropdownID(roomBedDropDownIDs)}
        />
      </div>
    </ConfirmDialog>
  )
}
