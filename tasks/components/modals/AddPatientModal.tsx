import { useState } from 'react'
import clsx from 'clsx'
import type { ConfirmModalProps, Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Input, ConfirmModal } from '@helpwave/hightide'
import { noop } from '@helpwave/hightide'
import { useAssignBedMutation, usePatientCreateMutation } from '@helpwave/api-services/mutations/tasks/patient_mutations'
import { emptyPatient } from '@helpwave/api-services/types/tasks/patient'
import type { RoomBedSelectIds } from '@/components/selects/RoomBedSelect'
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
    noBedSelected: 'No bed selected, the patient won\'t be assigned directly'
  },
  de: {
    addPatient: 'Patient Hinzufügen',
    name: 'Name',
    minimumLength: `Der Name muss mindestens {{characters}} characters lang sein`,
    noBedSelected: 'Kein Bett ausgewählt, der Patient wird nicht direkt zugeordnet'
  }
}

export type AddPatientModalProps = ConfirmModalProps & {
  wardId: string,
}

/**
 * A Modal for adding a Patient
 */
export const AddPatientModal = ({
  overwriteTranslation,
  wardId,
  headerProps,
  onConfirm = noop,
  ...modalProps
}: PropsForTranslation<AddPatientModalTranslation, AddPatientModalProps>) => {
  const translation = useTranslation([defaultAddPatientModalTranslation], overwriteTranslation)
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
    <ConfirmModal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation('addPatient')      }}
      onConfirm={() => {
        onConfirm()
        createPatient().catch(console.error)
      }}
      buttonOverwrites={[{}, {}, { disabled: !validPatientName }]}
      {...modalProps}
    >
      <div className="col gap-y-4 min-w-[300px]">
        <div className="col gap-y-1">
          <span className="textstyle-label-md">{translation('name')}</span>
          <Input
            value={patientName}
            onChangeText={(text) => {
              setTouched(true)
              setPatientName(text)
            }}
          />
          {isShowingError && <span className="textstyle-form-error">{translation('minimumLength', { replacements: { characters: minimumNameLength.toString() } })}</span>}
        </div>
        <RoomBedSelect
          initialRoomAndBed={dropdownId}
          wardId={wardId}
          onChange={(roomBedDropdownIds) => setDropdownId(roomBedDropdownIds)}
          isClearable={true}
        />
        <span className={clsx({ 'text-warning': !validRoomAndBed, 'text-transparent': validRoomAndBed })}>{translation('noBedSelected')}</span>
      </div>
    </ConfirmModal>
  )
}
