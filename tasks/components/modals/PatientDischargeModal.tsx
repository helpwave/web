import type { ConfirmDialogProps, Translation } from '@helpwave/hightide'
import { ConfirmDialog, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import type { PatientMinimalDTO } from '@helpwave/api-services/types/tasks/patient'

type PatientDischargeModalTranslation = {
  followingPatient: string,
  dischargePatient: string,
}

const defaultPatientDischargeModalTranslation: Translation<PatientDischargeModalTranslation> = {
  en: {
    followingPatient: 'The following patient will be discharged',
    dischargePatient: 'Discharge Patient?',
  },
  de: {
    followingPatient: 'Der folgende Patient wird entlassen',
    dischargePatient: 'Patient entlassen?',
  }
}

export type PatientDischargeModalProps = Omit<ConfirmDialogProps, 'titleElement' | 'description'> & {
  patient?: PatientMinimalDTO,
}

/**
 * A Modal to show when discharging Patients
 */
export const PatientDischargeModal = ({
                                        overwriteTranslation,
                                        patient,
                                        buttonOverwrites,
                                        ...confirmDialogProps
                                      }: PropsForTranslation<PatientDischargeModalTranslation, PatientDischargeModalProps>) => {
  const translation = useTranslation([defaultPatientDischargeModalTranslation], overwriteTranslation)
  return (
    <ConfirmDialog
      buttonOverwrites={buttonOverwrites ?? [{}, {}, { color: 'negative' }]}
      {...confirmDialogProps}
      titleElement={translation('dischargePatient')}
      description={`${translation('followingPatient')}:`}
    >
      {patient && (
        <span className="font-medium">{patient.humanReadableIdentifier}</span>
      )}
    </ConfirmDialog>
  )
}
