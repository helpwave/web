import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { BedInRoomIndicator } from '../BedInRoomIndicator'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import type { KanbanBoardObject } from './KanabanBoard'
import { KanbanBoard } from './KanabanBoard'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import useSaveDelay from '../../hooks/useSaveDelay'
import { TaskDetailModal } from '../TaskDetailModal'
import type { TaskDTO } from '../../mutations/task_mutations'
import type { PatientDTO } from '../../mutations/patient_mutations'

type PatientDetailTranslation = {
  patientDetails: string,
  notes: string,
  saveChanges: string,
  dischargeConfirmText: string,
  dischargePatient: string,
  saved: string
}

const defaultPatientDetailTranslations: Record<Languages, PatientDetailTranslation> = {
  en: {
    patientDetails: 'Patient Details',
    notes: 'Notes',
    saveChanges: 'Save Changes',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    dischargePatient: 'Discharge Patient',
    saved: 'Saved'
  },
  de: {
    patientDetails: 'Patienten Details',
    notes: 'Notizen',
    saveChanges: 'Speichern',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    dischargePatient: 'Patienten entlassen',
    saved: 'Gespeichert'
  }
}

type SortedTasks = {
  unscheduled: TaskDTO[],
  inProgress: TaskDTO[],
  done: TaskDTO[]
}

export type PatientDetailProps = {
  bedPosition: number,
  bedsInRoom: number,
  patient: PatientDTO,
  onUpdate: (patient: PatientDTO) => void,
  onDischarge: (patient: PatientDTO) => void,
  width?: number
}

/**
 * The right side of the ward/[uuid].tsx page showing the detailed information about the patient
 */
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
  const [isShowingSavedNotification, setIsShowingSavedNotification] = useState(false)
  const [sortedTasks, setSortedTasks] = useState<SortedTasks>({
    unscheduled: newPatient.tasks.filter(value => value.status === 'unscheduled'),
    inProgress: newPatient.tasks.filter(value => value.status === 'inProgress'),
    done: newPatient.tasks.filter(value => value.status === 'done'),
  })

  const { restartTimer, clearUpdateTimer } = useSaveDelay(setIsShowingSavedNotification, 3000)

  const changeSavedValue = (patient:PatientDTO) => {
    setNewPatient(patient)
    restartTimer(() => onUpdate(patient))
  }

  return (
    <div className={tw('relative flex flex-col py-4 px-6')}>
      {isShowingSavedNotification &&
        (
          <div
            className={tw('absolute top-2 right-2 bg-hw-positive-400 text-white rounded-lg px-2 py-1 animate-pulse')}
          >
            {translation.saved}
          </div>
        )
      }
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
      {/* newTask indicates whether the modal is open or not */}
      {newTask !== undefined && (
        <TaskDetailModal
          isOpen={true}
          onBackgroundClick={() => setNewTask(undefined)}
          modalClassName={tw('!p-0 rounded-l-none')}
          task={newTask}
          onChange={(task) => setNewTask(task)}
          onClose={() => setNewTask(undefined)}
          onFinishClick={() => {
            const changedPatient = {
              ...newPatient,
              tasks: [...newPatient.tasks.filter(value => value.id !== newTask.id), newTask]
            }
            if (newTask.id === '') {
              newTask.id = Math.random().toString() // TODO remove later
              newTask.creationDate = new Date()
            }
            setNewPatient(changedPatient)
            setSortedTasks({
              unscheduled: changedPatient.tasks.filter(value => value.status === 'unscheduled'),
              inProgress: changedPatient.tasks.filter(value => value.status === 'inProgress'),
              done: changedPatient.tasks.filter(value => value.status === 'done')
            })
            onUpdate(changedPatient)
            clearUpdateTimer()
            setNewTask(undefined)
          }}
        />
      )}
      <ColumnTitle title={translation.patientDetails}/>
      <div className={tw('flex flex-row gap-x-6 mb-8')}>
        <div className={tw('flex flex-col gap-y-4 w-5/12')}>
          <div className={tw('h-12 w-full')}>
            <ToggleableInput
              labelClassName={tw('text-xl font-semibold')}
              className={tw('text-lg font-semibold')}
              id="humanReadableIdentifier"
              value={newPatient.humanReadableIdentifier}
              onChange={humanReadableIdentifier => changeSavedValue({ ...newPatient, humanReadableIdentifier })}
            />
          </div>
          <BedInRoomIndicator bedsInRoom={bedsInRoom} bedPosition={bedPosition}/>
        </div>
        <div className={tw('flex-1')}>
          <Textarea
            headline={translation.notes}
            value={newPatient.note}
            onChange={text => changeSavedValue({ ...newPatient, note: text })}
          />
        </div>
      </div>
      <KanbanBoard
        key={newPatient.id}
        sortedTasks={sortedTasks}
        boardObject={boardObject}
        onBoardChange={setBoardObject}
        editedTaskID={newTask?.id}
        onChange={setSortedTasks}
        onEndChanging={sortedTasks => {
          onUpdate({
            ...newPatient,
            tasks: [...sortedTasks.unscheduled, ...sortedTasks.inProgress, ...sortedTasks.done]
          })
          clearUpdateTimer()
        }}
        onEditTask={task => {
          setNewTask(task)
        }}
      />
      <div className={tw('flex flex-row justify-end mt-8')}>
        <div>
          <Button color="negative" onClick={() => setIsShowingConfirmDialog(true)}
                  className={tw('mr-4')}>{translation.dischargePatient}</Button>
          <Button color="accent" onClick={() => {
            clearUpdateTimer(true)
            onUpdate(newPatient)
          }}>{translation.saveChanges}</Button>
        </div>
      </div>
    </div>
  )
}
