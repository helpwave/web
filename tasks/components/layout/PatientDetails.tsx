import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useContext, useEffect, useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { BedInRoomIndicator } from '../BedInRoomIndicator'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import { TasksKanbanBoard } from './TasksKanabanBoard'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { TaskDetailModal } from '../TaskDetailModal'
import type { PatientDetailsDTO } from '../../mutations/patient_mutations'
import {
  emptyPatientDetails,
  usePatientDetailsQuery,
  usePatientDischargeMutation,
  usePatientUpdateMutation,
  useUnassignMutation
} from '../../mutations/patient_mutations'
import { WardOverviewContext } from '../../pages/ward/[uuid]'
import useSaveDelay from '@helpwave/common/hooks/useSaveDelay'

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
  bedPosition: number,
  bedsInRoom: number,
  patient?: PatientDetailsDTO,
  width?: number
}

/**
 * The right side of the ward/[uuid].tsx page showing the detailed information about the patient
 */
export const PatientDetail = ({
  language,
  bedPosition,
  bedsInRoom,
  patient = emptyPatientDetails
}: PropsWithLanguage<PatientDetailTranslation, PatientDetailProps>) => {
  const [isShowingDischargeDialog, setIsShowingDischargeDialog] = useState(false)
  const translation = useTranslation(language, defaultPatientDetailTranslations)

  // TODO fetch patient by patient.id replace below
  const context = useContext(WardOverviewContext)

  const updateMutation = usePatientUpdateMutation(() => undefined)
  const dischargeMutation = usePatientDischargeMutation(() => context.updateContext({ wardID: context.state.wardID }))
  const unassignMutation = useUnassignMutation(() => context.updateContext({ wardID: context.state.wardID }))
  const { data, isError, isLoading } = usePatientDetailsQuery(() => undefined, context.state.patient?.id)

  const [newPatient, setNewPatient] = useState<PatientDetailsDTO>(patient)
  const [taskID, setTaskID] = useState<string>()
  const [isShowingSavedNotification, setIsShowingSavedNotification] = useState(false)

  useEffect(() => {
    if (data) {
      setNewPatient(data)
    }
  }, [data])

  const { restartTimer, clearUpdateTimer } = useSaveDelay(setIsShowingSavedNotification, 3000)

  const changeSavedValue = (patient: PatientDetailsDTO) => {
    setNewPatient(patient)
    restartTimer(() => updateMutation.mutate(patient))
  }

  if (isError) {
    return <div>Error in PatientDetails!</div>
  }

  if (isLoading) {
    return <div>Loading PatientDetails!</div>
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
        isOpen={isShowingDischargeDialog}
        onCancel={() => setIsShowingDischargeDialog(false)}
        onBackgroundClick={() => setIsShowingDischargeDialog(false)}
        onConfirm={() => {
          setIsShowingDischargeDialog(false)
          dischargeMutation.mutate(newPatient)
        }}
        confirmType="negative"
      />
      {/* taskID === '' is create and if set it's the tasks id */}
      {(!!taskID || taskID === '') && (
        <TaskDetailModal
          isOpen={true}
          onBackgroundClick={() => setTaskID(undefined)}
          onClose={() => setTaskID(undefined)}
          taskID={taskID}
          patientID={newPatient.id}
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
      {!!newPatient.id && (
        <TasksKanbanBoard
          key={newPatient.id}
          patientID={newPatient.id}
          editedTaskID={taskID}
          onEditTask={task => {
            setTaskID(task.id)
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
    </div>
  )
}
