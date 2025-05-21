import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { ConfirmDialog, type ConfirmDialogProps } from '@helpwave/hightide'
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
      buttonOverwrites={buttonOverwrites ?? [{}, {}, { color: 'negative' }]}
      {...confirmDialogProps}
    >
      {patient && (
        <>
          <span className="mt-2">{`${translation.followingPatient}: `}</span>
          <span className="font-medium">{patient.name}</span>
        </>
      )}
    </ConfirmDialog>
  )
}
