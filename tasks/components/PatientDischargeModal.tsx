import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PatientMinimalDTO } from '../mutations/patient_mutations'
import type { ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import { Span } from '@helpwave/common/components/Span'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import React from 'react'
import { tw } from '@helpwave/common/twind'

type PatientDischargeModalTranslation = {
  followingPatient: string,
  dischargePatient: string,
  dischargePatientDescription: string
}

const defaultPatientDischargeModalTranslation: Record<Languages, PatientDischargeModalTranslation > = {
  en: {
    followingPatient: 'The following patient will be discharged',
    dischargePatient: 'Discharge Patient?',
    dischargePatientDescription: 'This cannot be undone for now, be careful.'
  },
  de: {
    followingPatient: 'Der folgende Patient wird entlassen',
    dischargePatient: 'Patient entlassen?',
    dischargePatientDescription: 'Diese Aktion kann aktuell nicht rückgängig gemacht werden, vorsicht.'
  }
}

export type PatientDischargeModalProps = ConfirmDialogProps & {
  patient?: PatientMinimalDTO
}

/**
 * A Modal to show when discharging Patients
 */
export const PatientDischargeModal = ({
  language,
  patient,
  title,
  buttonOverwrites,
  ...confirmDialogProps
}: PropsWithLanguage<PatientDischargeModalTranslation, PatientDischargeModalProps>) => {
  const translation = useTranslation(language, defaultPatientDischargeModalTranslation)
  return (
    <ConfirmDialog
      {...confirmDialogProps}
      title={title ?? translation.dischargePatient}
      buttonOverwrites={buttonOverwrites ?? [{}, {}, { color: 'negative' }]}
    >
      {patient && <><Span>{`${translation.followingPatient}: `}</Span><Span className={tw('!font-medium')}>{patient.name}</Span></>}
      <Span className={tw('text-hw-warn-400')}>{translation.dischargePatientDescription}</Span>
    </ConfirmDialog>
  )
}
