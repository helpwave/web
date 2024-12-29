import { useState } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { ConfirmDialog, type ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { Input } from '@helpwave/common/components/user-input/Input'
import { noop } from '@helpwave/common/util/noop'
import { useAssignBedMutation, usePatientCreateMutation } from '@helpwave/api-services/mutations/tasks/patient_mutations'
import { emptyPatient } from '@helpwave/api-services/types/tasks/patient'
import type { RoomBedSelectIds } from '@/components/selects/RoomBedSelect'
import { RoomBedSelect } from '@/components/selects/RoomBedSelect'

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
  overwriteTranslation,
  wardId,
  titleText,
  onConfirm = noop,
  ...modalProps
}: PropsForTranslation<AddPatientModalTranslation, AddPatientModalProps>) => {
  const translation = useTranslation(defaultAddPatientModalTranslation, overwriteTranslation)
  const [dropdownId, setDropdownId] = useState<RoomBedSelectIds>({})
  const [patientName, setPatientName] = useState<string>('')
  const [touched, setTouched] = useState<boolean>(false)
  const assignBedMutation = useAssignBedMutation()
  const createPatientMutation = usePatientCreateMutation()

  const minimumNameLength = 4
  const trimmedPatientName = patientName.trim()
  const validPatientName = trimmedPatientName.length >= minimumNameLength
  const validRoomAndBed = dropdownId.roomId && dropdownId.bedId
  const isShowingError = touched && !validPatientName

  const createPatient = () => createPatientMutation.mutateAsync({ ...emptyPatient, name: trimmedPatientName })
    .then((patient) => {
      if (dropdownId.bedId) {
        return assignBedMutation.mutateAsync({ id: dropdownId.bedId, patientId: patient.id })
      }
    })

  return (
    <ConfirmDialog
      titleText={titleText ?? translation.addPatient}
      onConfirm={() => {
        onConfirm()
        createPatient()
      }}
      buttonOverwrites={[{}, {}, { disabled: !validPatientName }]}
      {...modalProps}
    >
      <div className={tw('flex flex-col gap-y-4 min-w-[300px]')}>
        <div className={tw('flex flex-col gap-y-1')}>
          <span className={tw('textstyle-label-md')}>{translation.name}</span>
          <Input
            value={patientName}
            onChange={(text) => {
              setTouched(true)
              setPatientName(text)
            }}
          />
          {isShowingError && <span className={tw('textstyle-form-error')}>{translation.minimumLength(minimumNameLength)}</span>}
        </div>
        <RoomBedSelect
          initialRoomAndBed={dropdownId}
          wardId={wardId}
          onChange={(roomBedDropdownIds) => setDropdownId(roomBedDropdownIds)}
          isClearable={true}
        />
        <span className={tx({ 'text-hw-warn-400': !validRoomAndBed, 'text-transparent': validRoomAndBed })}>{translation.noBedSelected}</span>
      </div>
    </ConfirmDialog>
  )
}
