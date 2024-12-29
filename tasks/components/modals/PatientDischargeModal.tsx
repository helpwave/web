import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { ConfirmDialog, type ConfirmDialogProps } from '@helpwave/common/components/modals/ConfirmDialog'
import type { PatientMinimalDTO } from '@helpwave/api-services/types/tasks/patient'

type PatientDischargeModalTranslation = {
  followingPatient: string,
  dischargePatient: string,
}

const defaultPatientDischargeModalTranslation: Record<Languages, PatientDischargeModalTranslation> = {
  en: {
    followingPatient: 'The following patient will be discharged',
    dischargePatient: 'Discharge Patient?',
  },
  de: {
    followingPatient: 'Der folgende Patient wird entlassen',
    dischargePatient: 'Patient entlassen?',
  }
}

export type PatientDischargeModalProps = Omit<ConfirmDialogProps, 'title' | 'descriptionText'> & {
  patient?: PatientMinimalDTO,
}

/**
 * A Modal to show when discharging Patients
 */
export const PatientDischargeModal = ({
  overwriteTranslation,
  patient,
  titleText,
  buttonOverwrites,
  ...confirmDialogProps
}: PropsForTranslation<PatientDischargeModalTranslation, PatientDischargeModalProps>) => {
  const translation = useTranslation(defaultPatientDischargeModalTranslation, overwriteTranslation)
  return (
    <ConfirmDialog
      titleText={titleText ?? translation.dischargePatient}
      buttonOverwrites={buttonOverwrites ?? [{}, {}, { color: 'hw-negative' }]}
      {...confirmDialogProps}
    >
      {patient && (
        <>
          <Span className={tw('mt-2')}>{`${translation.followingPatient}: `}</Span>
          <Span className={tw('!font-medium')}>{patient.name}</Span>
        </>
      )}
    </ConfirmDialog>
  )
}
