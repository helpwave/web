import type { Translation } from '@helpwave/hightide'
import { ConfirmModal, type ConfirmModalProps, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
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

export type PatientDischargeModalProps = Omit<ConfirmModalProps, 'title' | 'descriptionText'> & {
  patient?: PatientMinimalDTO,
}

/**
 * A Modal to show when discharging Patients
 */
export const PatientDischargeModal = ({
                                        overwriteTranslation,
                                        patient,
                                        buttonOverwrites,
                                        headerProps,
                                        ...confirmDialogProps
                                      }: PropsForTranslation<PatientDischargeModalTranslation, PatientDischargeModalProps>) => {
  const translation = useTranslation([defaultPatientDischargeModalTranslation], overwriteTranslation)
  return (
    <ConfirmModal
      headerProps={{ ...headerProps, titleText: headerProps?.titleText ?? translation('dischargePatient') }}
      buttonOverwrites={buttonOverwrites ?? [{}, {}, { color: 'negative' }]}
      {...confirmDialogProps}
    >
      {patient && (
        <>
          <span className="mt-2">{`${translation('followingPatient')}: `}</span>
          <span className="font-medium">{patient.name}</span>
        </>
      )}
    </ConfirmModal>
  )
}
