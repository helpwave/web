import { useContext, useEffect, useState } from 'react'

import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { SolidButton } from '@helpwave/hightide'
import { Textarea } from '@helpwave/hightide'
import { ToggleableInput } from '@helpwave/hightide'
import useSaveDelay from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import type { TaskStatus } from '@helpwave/api-services/types/tasks/task'
import {
  useAssignBedMutation,
  usePatientDetailsQuery,
  usePatientDischargeMutation,
  usePatientUpdateMutation,
  useUnassignMutation,
  useReadmitPatientMutation
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

const defaultPatientDetailTranslations: Record<Languages, PatientDetailTranslation> = {
  en: {
    patientDetails: 'Details',
    notes: 'Notes',
    saveChanges: 'Save Changes',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    dischargePatient: 'Discharge Patient',
    saved: 'Saved',
    unassign: 'Unassign',
    readmit: 'Readmit'
  },
  de: {
    patientDetails: 'Details',
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
  const translation = useTranslation(defaultPatientDetailTranslations, overwriteTranslation)

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
    clearUpdateTimer
  } = useSaveDelay(setIsShowingSavedNotification, 3000)

  const changeSavedValue = (patient: PatientDetailsDTO) => {
    setNewPatient(patient)
    restartTimer(() => updateMutation.mutate(patient))
  }

  const isShowingTask = !!taskId || taskId === ''

  return (
    <div className="relative col py-4 px-6">
      {isShowingSavedNotification &&
        (
          <div
            className="absolute top-2 right-2 bg-positive text-on-positive rounded-lg px-2 py-1 animate-pulse"
          >
            {translation.saved}
          </div>
        )
      }
      <PatientDischargeModal
        id="PatientDetail-DischargeDialog"
        isOpen={isShowingDischargeDialog}
        onCancel={() => setIsShowingDischargeDialog(false)}
        onBackgroundClick={() => setIsShowingDischargeDialog(false)}
        onCloseClick={() => setIsShowingDischargeDialog(false)}
        onConfirm={() => {
          dischargeMutation.mutate(newPatient.id)
          setIsShowingDischargeDialog(false)
        }}
        patient={newPatient}
      />
      {/* taskId === '' is create and if set it's the tasks id */}
      <TaskDetailModal
        id="PatientDetail-TaskDetailModal"
        isOpen={isShowingTask}
        onBackgroundClick={() => setTaskId(undefined)}
        onClose={() => setTaskId(undefined)}
        wardId={wardId}
        taskId={taskId}
        patientId={newPatient.id}
        initialStatus={initialTaskStatus}
      />
      <ColumnTitle title={translation.patientDetails}/>
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
                onChange={name => changeSavedValue({
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
              headline={translation.notes}
              value={newPatient.note}
              onChange={text => changeSavedValue({
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
                  {translation.unassign}
                </SolidButton>
                <SolidButton color="negative" onClick={() => setIsShowingDischargeDialog(true)} >
                  {translation.dischargePatient}
                </SolidButton>
              </>
              ) : (
              <SolidButton color="positive" onClick={() => readmitMutation.mutate(newPatient.id)} >
                {translation.readmit}
              </SolidButton>
              )}
          <SolidButton color="primary" onClick={() => {
            clearUpdateTimer(true)
            updateMutation.mutate(newPatient)
          }}>{translation.saveChanges}</SolidButton>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
