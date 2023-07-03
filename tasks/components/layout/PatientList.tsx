import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import type { PatientDTO } from '../../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user_input/Input'

type PatientListTranslation = {
  patients: string,
  active: string,
  unassigned: string,
  discharged: string,
  discharge: string,
  dischargeConfirmText: string,
  delete: string,
  deleteConfirmText: string,
  deleteDescriptionText: string,
  addPatient: string,
  search: string
}

const defaultPatientListTranslations: Record<Languages, PatientListTranslation> = {
  en: {
    patients: 'Patients',
    active: 'Active',
    unassigned: 'Unassigned',
    discharged: 'Discharged',
    discharge: 'Discharge',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    delete: 'Delete',
    deleteConfirmText: 'Do you really want to delete the patient?',
    deleteDescriptionText: 'All information about the patient will be deleted and you will have to register the patient again.',
    addPatient: 'Add Patient',
    search: 'Suchen'
  },
  de: {
    patients: 'Patienten',
    active: 'Active',
    unassigned: 'Nicht zugeordnet',
    discharged: 'Entlassene',
    discharge: 'Entlassen',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    delete: 'Löschen',
    deleteConfirmText: 'Willst du den Patienten wirklich löschen?',
    deleteDescriptionText: 'Alle Informationen bezüglich des Patienten werden gelöschet und der Patient müsste erneut registriert werden.',
    addPatient: 'Patient hinzufügen',
    search: 'Suchen'
  }
}

export type PatientListProps = {
  onDischarge: (patient: PatientDTO) => void,
  width?: number
}

/**
 * The right side of the ward/[uuid].tsx page showing the detailed information about the patients in the ward
 */
export const PatientList = ({
  language,
  ward,
  width
}: PropsWithLanguage<PatientListTranslation, PatientListProps>) => {
  const translation = useTranslation(language, defaultPatientListTranslations)
  const [search, setSearch] = useState('')
  return (
    <div className={tw('relative flex flex-col py-4 px-6')}>
      <div className={tw('flex flex-row gap-x-2 items-end')}>
        <Span type="subsectionTitle" className={tw('pr-4')}>{translation.patients}</Span>
        <Input value={search} onChange={setSearch}/>
        <Button
          color="positive"
          onClick={() => {
            // TODO open add patient screen
          }}
        >
          {translation.addPatient}
        </Button>
      </div>
    </div>
  )
}
