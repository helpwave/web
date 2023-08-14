import { tw, tx } from '@helpwave/common/twind'
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
  minimumLength: (characters: number) => string,
  noBedSelected: string
}

const defaultAddPatientModalTranslation: Record<Languages, AddPatientModalTranslation> = {
  en: {
    addPatient: 'Add Patient',
    name: 'Name',
    minimumLength: (characters: number) => `The Name must be at least ${characters} characters long`,
    noBedSelected: 'No bed selected, the patient won\'t be assigned directly'
  },
  de: {
    addPatient: 'Patient Hinzufügen',
    name: 'Name',
    minimumLength: (characters: number) => `Der Name muss mindestens ${characters} characters lang sein`,
    noBedSelected: 'Kein Bett ausgewählt, der Patient wird nicht direkt zugeordnet'
  }
}

export type AddPatientModalProps = ConfirmDialogProps & {
  wardID: string
}

/**
 * A Modal for adding a Patient
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
    }
  })

  const minimumNameLength = 4
  const trimmedPatientName = patientName.trim()
  const validPatientName = trimmedPatientName.length >= minimumNameLength
  const validRoomAndBed = dropdownID.roomID && dropdownID.bedID
  const isShowingError = touched && !validPatientName

  return (
    <ConfirmDialog
      title={title ?? translation.addPatient}
      onConfirm={() => {
        onConfirm()
        createPatientMutation.mutate({ ...emptyPatient, name: trimmedPatientName })
      }}
      buttonOverwrites={[{}, {}, { disabled: !validPatientName }]}
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
          isClearable={true}
        />
        <Span className={tx({ 'text-hw-warn-400': !validRoomAndBed, 'text-transparent': validRoomAndBed })}>{translation.noBedSelected}</Span>
      </div>
    </ConfirmDialog>
  )
}
