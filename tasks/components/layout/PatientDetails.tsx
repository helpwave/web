import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useEffect, useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { BedInRoomIndicator } from '../BedInRoomIndicator'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import type { KanbanBoardObject } from './KanabanBoard'
import { KanbanBoard } from './KanabanBoard'
import type { PatientDTO, TaskDTO } from '../../mutations/room_mutations'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { TaskDetailView } from './TaskDetailView'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'

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
  onDischarge: (patient: PatientDTO) => void
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
  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [notificationTimer, setNotificationTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [sortedTasks, setSortedTasks] = useState<SortedTasks>({
    unscheduled: newPatient.tasks.filter(value => value.status === 'unscheduled'),
    inProgress: newPatient.tasks.filter(value => value.status === 'inProgress'),
    done: newPatient.tasks.filter(value => value.status === 'done'),
  })
  // Delete interval timer afterwards
  useEffect(() => {
    return () => {
      clearInterval(updateTimer)
      clearInterval(notificationTimer)
    }
  })

  const changeWithUpdateTimer = (newPatient: PatientDTO) => {
    setNewPatient(newPatient)
    clearInterval(updateTimer)
    // No patient validation, maybe check whether this is right
    setUpdateTimer(setInterval(() => {
      onUpdate(newPatient)
      // Show Saved Notification for fade animation duration
      clearInterval(notificationTimer)
      setNotificationTimer(undefined)
      setNotificationTimer(setInterval(() => {
        clearInterval(notificationTimer)
        setNotificationTimer(undefined)
      }, 3000))
    }, 3000))
  }

  return (
    <div className={tw('relative flex flex-col py-4 px-6')}>
      {notificationTimer !== undefined &&
        (
          <div
            className={tw('absolute top-2 right-2 bg-hw-positive-400 text-white rounded-lg px-2 py-1 animate-fade')}
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
              const changedPatient = {
                ...newPatient,
                tasks: [...newPatient.tasks.filter(value => value.id !== newTask.id), newTask]
              }
              if (newTask.id === '') {
                newTask.id = Math.random().toString() // TODO remove later
                newTask.creationDate = Date()
              }
              setNewPatient(changedPatient)
              onUpdate(changedPatient)
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
              onChange={humanReadableIdentifier => changeWithUpdateTimer({ ...newPatient, humanReadableIdentifier })}
            />
          </div>
          <BedInRoomIndicator bedsInRoom={bedsInRoom} bedPosition={bedPosition}/>
        </div>
        <div className={tw('flex-1')}>
          <Textarea
            headline={translation.notes}
            value={newPatient.note}
            onChange={text => changeWithUpdateTimer({ ...newPatient, note: text })}
          />
        </div>
      </div>
      <KanbanBoard
        key={newPatient.id}
        sortedTasks={sortedTasks}
        boardObject={boardObject}
        onBoardChange={setBoardObject}
        editedTaskID={newTask?.id}
        onChange={sortedTasks => setSortedTasks(sortedTasks)}
        onEndChanging={sortedTasks => onUpdate({
          ...newPatient,
          tasks: [...sortedTasks.unscheduled, ...sortedTasks.inProgress, ...sortedTasks.done]
        })}
        onEditTask={task => {
          setNewTask(task)
        }}
      />
      <div className={tw('flex flex-row justify-end mt-8')}>
        <div>
          <Button color="negative" onClick={() => setIsShowingConfirmDialog(true)}
                  className={tw('mr-4')}>{translation.dischargePatient}</Button>
          <Button color="accent" onClick={() => onUpdate(newPatient)}>{translation.saveChanges}</Button>
        </div>
      </div>
    </div>
  )
}
