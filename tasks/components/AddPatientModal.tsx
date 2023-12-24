import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import React, { useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user-input/Input'
import { noop } from '@helpwave/common/util/noop'
import { emptyPatient, useAssignBedMutation, usePatientCreateMutation } from '../mutations/patient_mutations'
import { useWardQuery } from '../mutations/ward_mutations'
import { RoomBedDropDown } from './RoomBedDropDown'
import type { RoomBedDropDownIds } from './RoomBedDropDown'

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
  wardId: string
}

/**
 * A Modal for adding a Patient
 */
export const AddPatientModal = ({
  language,
  wardId,
  titleText,
  onConfirm = noop,
  ...modalProps
}: PropsWithLanguage<AddPatientModalTranslation, AddPatientModalProps>) => {
  const translation = useTranslation(language, defaultAddPatientModalTranslation)
  const [dropdownId, setDropdownId] = useState<RoomBedDropDownIds>({})
  const [patientName, setPatientName] = useState<string>('')
  const [touched, setTouched] = useState<boolean>(false)
  const assignBedMutation = useAssignBedMutation()
  const { data: ward } = useWardQuery(wardId)
  const organisationId = ward?.organizationId ?? ''
  const createPatientMutation = usePatientCreateMutation(organisationId, patient => {
    if (dropdownId.bedId) {
      assignBedMutation.mutate({ id: dropdownId.bedId, patientId: patient.id })
    }
  })

  const minimumNameLength = 4
  const trimmedPatientName = patientName.trim()
  const validPatientName = trimmedPatientName.length >= minimumNameLength
  const validRoomAndBed = dropdownId.roomId && dropdownId.bedId
  const isShowingError = touched && !validPatientName

  return (
    <ConfirmDialog
      titleText={titleText ?? translation.addPatient}
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
          initialRoomAndBed={dropdownId}
          wardId={wardId}
          onChange={roomBedDropDownIds => setDropdownId(roomBedDropDownIds)}
          isClearable={true}
        />
        <Span className={tx({ 'text-hw-warn-400': !validRoomAndBed, 'text-transparent': validRoomAndBed })}>{translation.noBedSelected}</Span>
      </div>
    </ConfirmDialog>
  )
}
