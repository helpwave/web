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
import type { PatientDTO, TaskDTO } from '../../mutations/room_mutations'
import { ToggleableInput } from '../user_input/ToggleableInput'
import { Modal } from '../modals/Modal'
import { TaskDetailView } from './TaskDetailView'

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
  const [newTask, setNewTask] = useState<TaskDTO|undefined>(undefined)

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <Modal
        isOpen={newTask !== undefined}
      >
        {newTask !== undefined && (
            <TaskDetailView
              task={newTask}
              onChange={(task) => setNewTask(task)}
              onClose={() => setNewTask(undefined)}
              onFinishClick={() => {
                // currently, adding a new task isn't immediately called in the backend, but requires an update
                const changedPatient = { ...newPatient, tasks: [...newPatient.tasks.filter(value => value.id !== newTask.id), newTask] }
                if (newTask.id === '') {
                  setNewPatient(changedPatient)
                } else {
                  setNewPatient(changedPatient)
                  onUpdate(changedPatient)
                }
                setNewTask(undefined)
              }}
            />
        )}
      </Modal>
      <ColumnTitle title={translation.patientDetails}/>
      <div className={tw('flex flex-row justify-between gap-x-8 mb-8')}>
        <div className={tw('flex flex-col gap-y-4 w-1/2')}>
          <div className={tw('h-12 w-full')}>
            <ToggleableInput
              labelClassName={tw('text-xl font-semibold')}
              className={tw('text-lg font-semibold')}
              id="humanReadableIdentifier"
              value={newPatient.humanReadableIdentifier}
              onChange={humanReadableIdentifier => setNewPatient({
                ...newPatient,
                humanReadableIdentifier
              })}
            />
          </div>
          <BedInRoomIndicator bedsInRoom={bedsInRoom} bedPosition={bedPosition}/>
        </div>
        <div className={tw('w-1/2')}>
          <Textarea
            headline={translation.notes}
            value={newPatient.note}
            onChange={text => setNewPatient({ ...newPatient, note: text })}
          />
        </div>
      </div>
      <KanbanBoard
        key={newPatient.id + newPatient.tasks.toString()}
        tasks={newPatient.tasks}
        editedTaskID={newTask?.id}
        onChange={tasks => setNewPatient({ ...newPatient, tasks })}
        onEditTask={task => {
          setNewTask(task)
        }}
      />
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
