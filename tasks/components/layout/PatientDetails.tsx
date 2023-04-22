import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '../Button'
import { BedInRoomIndicator } from '../BedInRoomIndicator'
import { Textarea } from '../user_input/Textarea'
import type { KanbanBoardObject } from './KanabanBoard'
import { KanbanBoard } from './KanabanBoard'
import type { PatientDTO, TaskDTO } from '../../mutations/room_mutations'
import { ToggleableInput } from '../user_input/ToggleableInput'
import { Modal } from '../modals/Modal'
import { TaskDetailView } from './TaskDetailView'
import { ConfirmDialog } from '../modals/ConfirmDialog'

type PatientDetailTranslation = {
  patientDetails: string,
  notes: string,
  saveChanges: string,
  dischargeConfirmText: string,
  dischargePatient: string
}

const defaultPatientDetailTranslations: Record<Languages, PatientDetailTranslation> = {
  en: {
    patientDetails: 'Patient Details',
    notes: 'Notes',
    saveChanges: 'Save Changes',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    dischargePatient: 'Discharge Patient',
  },
  de: {
    patientDetails: 'Patienten Details',
    notes: 'Notizen',
    saveChanges: 'Speichern',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    dischargePatient: 'Patienten entlassen',
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
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)
  const translation = useTranslation(language, defaultPatientDetailTranslations)
  const [newPatient, setNewPatient] = useState<PatientDTO>(patient)
  const [newTask, setNewTask] = useState<TaskDTO | undefined>(undefined)
  const [boardObject, setBoardObject] = useState<KanbanBoardObject>({ searchValue: '' })
  const sortedTasks = {
    unscheduled: newPatient.tasks.filter(value => value.status === 'unscheduled'),
    inProgress: newPatient.tasks.filter(value => value.status === 'inProgress'),
    done: newPatient.tasks.filter(value => value.status === 'done'),
  }

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <ConfirmDialog
        title={translation.dischargeConfirmText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDischarge(newPatient)
        }}
        confirmType="negative"
      />
      <Modal
        isOpen={newTask !== undefined}
        onBackgroundClick={() => setNewTask(undefined)}
      >
        {newTask !== undefined && (
          <TaskDetailView
            task={newTask}
            onChange={(task) => setNewTask(task)}
            onClose={() => setNewTask(undefined)}
            onFinishClick={() => {
              // currently, adding a new task isn't immediately called in the backend, but requires an update
              const changedPatient = {
                ...newPatient,
                tasks: [...newPatient.tasks.filter(value => value.id !== newTask.id), newTask]
              }
              if (newTask.id === '') {
                newTask.id = Math.random().toString() // TODO remove later
                newTask.creationDate = Date()
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
      <div className={tw('flex flex-row gap-x-6 mb-8')}>
        <div className={tw('flex flex-col gap-y-4 w-5/12')}>
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
        <div className={tw('flex-1')}>
          <Textarea
            headline={translation.notes}
            value={newPatient.note}
            onChange={text => setNewPatient({ ...newPatient, note: text })}
          />
        </div>
      </div>
      <KanbanBoard
        key={newPatient.id}
        sortedTasks={sortedTasks}
        boardObject={boardObject}
        onBoardChange={setBoardObject}
        editedTaskID={newTask?.id}
        onChange={sortedTasks => setNewPatient({
          ...newPatient,
          tasks: [...sortedTasks.unscheduled, ...sortedTasks.inProgress, ...sortedTasks.done]
        })}
        onEditTask={task => {
          setNewTask(task)
        }}
      />
      <div className={tw('flex flex-row justify-end mt-8')}>
        <div>
          <Button color="negative" onClick={() => setIsShowingConfirmDialog(true)} className={tw('mr-4')}>{translation.dischargePatient}</Button>
          <Button color="accent" onClick={() => onUpdate(newPatient)}>{translation.saveChanges}</Button>
        </div>
      </div>
    </div>
  )
}
