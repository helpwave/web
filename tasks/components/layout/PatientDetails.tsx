import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '../Button'
import { BedInRoomIndicator } from '../BedInRoomIndicator'
import { Textarea } from '../user_input/Textarea'
import { KanbanBoard } from './KanabanBoard'
import type { PatientDTO } from '../../mutations/room_mutations'

type PatientDetailTranslation = {
  patientDetails: string,
  notes: string,
  dischargePatient: string,
  saveChanges: string,
  dischargeConfirm: string
}

const defaultPatientDetailTranslations: Record<Languages, PatientDetailTranslation> = {
  en: {
    patientDetails: 'Patient Details',
    notes: 'Notes',
    dischargePatient: 'Discharge Patient',
    saveChanges: 'Save Changes',
    dischargeConfirm: 'Do you really want to discharge the patient?'
  },
  de: {
    patientDetails: 'Patienten Details',
    notes: 'Notizen',
    dischargePatient: 'Patienten entlassen',
    saveChanges: 'Speichern',
    dischargeConfirm: 'Willst du den Patienten wirklich entlassen?'
  }
}

export type PatientDetailProps = {
  bedPosition: number,
  bedsInRoom: number,
  patient: PatientDTO,
  onUpdate: (patient: PatientDTO) => void,
  onDischarge: (patient: PatientDTO) => void
}

export const PatientDetail = ({
  language,
  bedPosition,
  bedsInRoom,
  patient,
  onUpdate,
  onDischarge
}: PropsWithLanguage<PatientDetailTranslation, PatientDetailProps>) => {
  const translation = useTranslation(language, defaultPatientDetailTranslations)
  const [newPatient, setNewPatient] = useState<PatientDTO>(patient)

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <ColumnTitle title={translation.patientDetails}/>
      <div className={tw('flex flex-row justify-between gap-x-8 mb-8')}>
        <div className={tw('flex flex-col gap-y-4')}>
          <span className={tw('text-xl font-semibold')}>{newPatient.humanReadableIdentifier}</span>
          <BedInRoomIndicator bedsInRoom={bedsInRoom} bedPosition={bedPosition}/>
        </div>
        <div className={tw('flex-1')}>
          <Textarea
            headline={translation.notes}
            value={newPatient.note}
            onChange={text => setNewPatient({ ...newPatient, note: text })}
          />
        </div>
      </div>
      <KanbanBoard key={newPatient.id + newPatient.tasks.toString()} tasks={newPatient.tasks} onChange={tasks => setNewPatient({ ...newPatient, tasks })}/>
      <div className={tw('flex flex-row justify-end mt-8')}>
        <div>
          <Button color="negative" onClick={() => {
            if (confirm(translation.dischargeConfirm)) {
              onDischarge(newPatient)
            }
          }} className={tw('mr-4')}>{translation.dischargePatient}</Button>
          <Button color="accent" onClick={() => onUpdate(newPatient)}>{translation.saveChanges}</Button>
        </div>
      </div>
    </div>
  )
}
