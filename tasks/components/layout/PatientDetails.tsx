import { useContext, useEffect, useState } from 'react'

import type { Translation } from '@helpwave/hightide'
import { useDelay } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  type PropsForTranslation,
  SolidButton,
  Textarea,
  ToggleableInput,
  useTranslation
} from '@helpwave/hightide'
import type { TaskStatus } from '@helpwave/api-services/types/tasks/task'
import {
  useAssignBedMutation,
  usePatientDetailsQuery,
  usePatientDischargeMutation,
  usePatientUpdateMutation,
  useReadmitPatientMutation,
  useUnassignMutation
} from '@helpwave/api-services/mutations/tasks/patient_mutations'
import type { PatientDetailsDTO } from '@helpwave/api-services/types/tasks/patient'
import { emptyPatientDetails } from '@helpwave/api-services/types/tasks/patient'
import { ColumnTitle } from '../ColumnTitle'
import { TasksKanbanBoard } from './TasksKanbanBoard'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import { PatientDischargeModal } from '@/components/modals/PatientDischargeModal'
import { TaskDetailModal } from '@/components/modals/TaskDetailModal'
import { RoomBedSelect } from '@/components/selects/RoomBedSelect'
import { PropertyList } from '@/components/layout/property/PropertyList'

type PatientDetailTranslation = {
  patientDetails: string,
  notes: string,
  saveChanges: string,
  dischargeConfirmText: string,
  dischargePatient: string,
  saved: string,
  unassign: string,
  readmit: string,
}

const defaultPatientDetailTranslations: Translation<PatientDetailTranslation> = {
  en: {
    patientDetails: 'Patient Details',
    notes: 'Notes',
    saveChanges: 'Save Changes',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    dischargePatient: 'Discharge Patient',
    saved: 'Saved',
    unassign: 'Unassign',
    readmit: 'Readmit'
  },
  de: {
    patientDetails: 'Patienten Details',
    notes: 'Notizen',
    saveChanges: 'Speichern',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    dischargePatient: 'Patienten entlassen',
    saved: 'Gespeichert',
    unassign: 'Zuweisung aufheben',
    readmit: 'Wiederzuweisen'
  }
}

export type PatientDetailProps = {
  wardId: string,
  patient?: PatientDetailsDTO,
  width?: number,
}

/**
 * The right side of the ward/[wardId].tsx page showing the detailed information about the patient
 */
export const PatientDetail = ({
                                overwriteTranslation,
                                wardId,
                                patient = emptyPatientDetails
                              }: PropsForTranslation<PatientDetailTranslation, PatientDetailProps>) => {
  const [isShowingDischargeDialog, setIsShowingDischargeDialog] = useState(false)
  const translation = useTranslation([defaultPatientDetailTranslations], overwriteTranslation)

  const context = useContext(WardOverviewContext)

  const updateMutation = usePatientUpdateMutation()
  const readmitMutation = useReadmitPatientMutation()
  const dischargeMutation = usePatientDischargeMutation(() => context.updateContext({ wardId: context.state.wardId }))
  const unassignMutation = useUnassignMutation(() => context.updateContext({ wardId: context.state.wardId }))
  const {
    data,
    isError,
    isLoading
  } = usePatientDetailsQuery(context.state.patientId)

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

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay: 3000 })

  const changeSavedValue = (patient: PatientDetailsDTO) => {
    setNewPatient(patient)
    restartTimer(() => {
      updateMutation.mutate(patient)
      setIsShowingSavedNotification(false)
    })
  }

  const isShowingTask = !!taskId || taskId === ''

  return (
    <div className="relative col py-4 px-6">

      <PatientDischargeModal
        isOpen={isShowingDischargeDialog}
        onCancel={() => setIsShowingDischargeDialog(false)}
        onConfirm={() => {
          dischargeMutation.mutate(newPatient.id)
          setIsShowingDischargeDialog(false)
        }}
        patient={newPatient}
      />
      {/* taskId === '' is create and if set it's the tasks id */}
      <TaskDetailModal
        isOpen={isShowingTask}
        onClose={() => setTaskId(undefined)}
        wardId={wardId}
        taskId={taskId}
        patientId={newPatient.id}
        initialStatus={initialTaskStatus}
      />
      <ColumnTitle
        title={translation('patientDetails')}
        actions={isShowingSavedNotification && (
          <div className="bg-positive text-on-positive rounded-lg px-2 py-1 animate-pulse">
            {translation('saved')}
          </div>
        )}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        <div className="row gap-x-6 mb-8">
          <div className="col gap-y-2 w-5/12">
            <div className="h-12 w-full">
              <ToggleableInput
                maxLength={maxHumanReadableIdentifierLength}
                labelClassName="text-xl font-semibold"
                className="text-lg font-semibold"
                id="humanReadableIdentifier"
                value={newPatient.name}
                onChangeText={name => changeSavedValue({
                  ...newPatient,
                  name
                })}
              />
            </div>
            <RoomBedSelect
              initialRoomAndBed={{
                roomId: context.state.roomId ?? '',
                bedId: context.state.bedId ?? ''
              }}
              wardId={context.state.wardId}
              onChange={(roomBedDropdownIds) => {
                if (roomBedDropdownIds.bedId && context.state.patientId) {
                  readmitMutation.mutate(newPatient.id)
                  context.updateContext({ ...context.state, ...roomBedDropdownIds })
                  assignBedMutation.mutate({
                    id: roomBedDropdownIds.bedId,
                    patientId: context.state.patientId
                  })
                }
              }}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="flex-1">
            <Textarea
              headline={translation('notes')}
              value={newPatient.note}
              onChangeText={text => changeSavedValue({
                ...newPatient,
                note: text
              })}
            />
          </div>
        </div>
        {!!newPatient.id && (
          <TasksKanbanBoard
            key={newPatient.id}
            patientId={newPatient.id}
            editedTaskId={taskId}
            onEditTask={task => {
              setInitialTaskStatus(task.status === 'done' ? 'todo' : task.status)
              setTaskId(task.id)
            }}
          />
        )}
        {!!newPatient.id && (
          <div className="mt-4">
            <PropertyList subjectId={newPatient.id} subjectType="patient"/>
          </div>
        )}
        <div className="row justify-end mt-8 gap-x-4">
          {!newPatient.discharged ?
            (
              <>
                <SolidButton color="warning" onClick={() => unassignMutation.mutate(newPatient.id)}>
                  {translation('unassign')}
                </SolidButton>
                <SolidButton color="negative" onClick={() => setIsShowingDischargeDialog(true)}>
                  {translation('dischargePatient')}
                </SolidButton>
              </>
            ) : (
              <SolidButton color="positive" onClick={() => readmitMutation.mutate(newPatient.id)}>
                {translation('readmit')}
              </SolidButton>
            )}
          <SolidButton color="primary" onClick={() => {
            clearTimer()
            updateMutation.mutate(newPatient)
          }}>{translation('saveChanges')}</SolidButton>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
