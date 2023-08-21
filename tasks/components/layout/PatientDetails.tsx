import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useContext, useEffect, useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import { TasksKanbanBoard } from './TasksKanabanBoard'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { TaskDetailModal } from '../TaskDetailModal'
import type { PatientDetailsDTO } from '../../mutations/patient_mutations'
import {
  emptyPatientDetails,
  useAssignBedMutation,
  usePatientDetailsQuery,
  usePatientDischargeMutation,
  usePatientUpdateMutation,
  useUnassignMutation
} from '../../mutations/patient_mutations'
import { WardOverviewContext } from '../../pages/ward/[id]'
import useSaveDelay from '@helpwave/common/hooks/useSaveDelay'
import { RoomBedDropDown } from '../RoomBedDropDown'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'

type PatientDetailTranslation = {
  patientDetails: string,
  notes: string,
  saveChanges: string,
  dischargeConfirmText: string,
  dischargePatient: string,
  saved: string,
  unassign: string
}

const defaultPatientDetailTranslations: Record<Languages, PatientDetailTranslation> = {
  en: {
    patientDetails: 'Patient Details',
    notes: 'Notes',
    saveChanges: 'Save Changes',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    dischargePatient: 'Discharge Patient',
    saved: 'Saved',
    unassign: 'Unassign'
  },
  de: {
    patientDetails: 'Patienten Details',
    notes: 'Notizen',
    saveChanges: 'Speichern',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    dischargePatient: 'Patienten entlassen',
    saved: 'Gespeichert',
    unassign: 'Zuweisung aufheben'
  }
}

export type PatientDetailProps = {
  patient?: PatientDetailsDTO,
  width?: number
}

/**
 * The right side of the ward/[id].tsx page showing the detailed information about the patient
 */
export const PatientDetail = ({
  language,
  patient = emptyPatientDetails
}: PropsWithLanguage<PatientDetailTranslation, PatientDetailProps>) => {
  const [isShowingDischargeDialog, setIsShowingDischargeDialog] = useState(false)
  const translation = useTranslation(language, defaultPatientDetailTranslations)

  const context = useContext(WardOverviewContext)

  const updateMutation = usePatientUpdateMutation(() => undefined)
  const dischargeMutation = usePatientDischargeMutation(() => context.updateContext({ wardId: context.state.wardId }))
  const unassignMutation = useUnassignMutation(() => context.updateContext({ wardId: context.state.wardId }))
  const { data, isError, isLoading } = usePatientDetailsQuery(context.state.patientId)

  const [newPatient, setNewPatient] = useState<PatientDetailsDTO>(patient)
  const [taskId, setTaskId] = useState<string>()
  const [isShowingSavedNotification, setIsShowingSavedNotification] = useState(false)
  const [initialTaskStatus, setInitialTaskStatus] = useState<TaskStatus>()

  const maxHumanReadableIdentifierLength = 24

  useEffect(() => {
    if (data) {
      setNewPatient(data)
    }
  }, [data])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const assignBedMutation = useAssignBedMutation(() => {
    setIsSubmitting(false)
  })

  const { restartTimer, clearUpdateTimer } = useSaveDelay(setIsShowingSavedNotification, 3000)

  const changeSavedValue = (patient: PatientDetailsDTO) => {
    setNewPatient(patient)
    restartTimer(() => updateMutation.mutate(patient))
  }

  const isShowingTask = !!taskId || taskId === ''

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
        id="PatientDetail-DischargeDialog"
        title={translation.dischargeConfirmText}
        isOpen={isShowingDischargeDialog}
        onCancel={() => setIsShowingDischargeDialog(false)}
        onBackgroundClick={() => setIsShowingDischargeDialog(false)}
        onConfirm={() => {
          dischargeMutation.mutate(newPatient.id)
          setIsShowingDischargeDialog(false)
        }}
        confirmType="negative"
      />
      {/* taskId === '' is create and if set it's the tasks id */}
      <TaskDetailModal
        id="PatientDetail-TaskDetailModal"
        isOpen={isShowingTask}
        onBackgroundClick={() => setTaskId(undefined)}
        onClose={() => setTaskId(undefined)}
        taskId={taskId}
        patientId={newPatient.id}
        initialStatus={initialTaskStatus}
      />
      <ColumnTitle title={translation.patientDetails}/>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        <div className={tw('flex flex-row gap-x-6 mb-8')}>
          <div className={tw('flex flex-col gap-y-2 w-5/12')}>
            <div className={tw('h-12 w-full')}>
              <ToggleableInput
                maxLength={maxHumanReadableIdentifierLength}
                labelClassName={tw('text-xl font-semibold')}
                className={tw('text-lg font-semibold')}
                id="humanReadableIdentifier"
                value={newPatient.name}
                onChange={name => changeSavedValue({ ...newPatient, name })}
              />
            </div>
            <RoomBedDropDown
              initialRoomAndBed={{ roomId: context.state.roomId ?? '', bedId: context.state.bedId ?? '' }}
              wardId={context.state.wardId}
              onChange={roomBedDropDownIds => {
                if (roomBedDropDownIds.bedId && context.state.patientId) {
                  context.updateContext({ ...context.state, ...roomBedDropDownIds })
                  assignBedMutation.mutate({ id: roomBedDropDownIds.bedId, patientId: context.state.patientId })
                }
              }}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className={tw('flex-1')}>
            <Textarea
              headline={translation.notes}
              value={newPatient.note}
              onChange={text => changeSavedValue({ ...newPatient, note: text })}
            />
          </div>
        </div>
        {!!newPatient.id && (
          <TasksKanbanBoard
            key={newPatient.id}
            patientId={newPatient.id}
            editedTaskId={taskId}
            onEditTask={task => {
              setInitialTaskStatus(task.status === TaskStatus.TASK_STATUS_DONE ? TaskStatus.TASK_STATUS_TODO : task.status)
              setTaskId(task.id)
            }}
          />
        )}
        <div className={tw('flex flex-row justify-end mt-8 gap-x-4')}>
          <Button color="warn" onClick={() => unassignMutation.mutate(newPatient.id)}>{translation.unassign}</Button>
          <Button color="negative"
                  onClick={() => setIsShowingDischargeDialog(true)}>{translation.dischargePatient}</Button>
          <Button color="accent" onClick={() => {
            clearUpdateTimer(true)
            updateMutation.mutate(newPatient)
          }}>{translation.saveChanges}</Button>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
