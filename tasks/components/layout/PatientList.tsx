import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import React, { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user_input/Input'
import type { PatientDTO, PatientWithBedAndRoomDTO } from '../../mutations/patient_mutations'
import { usePatientDischargeMutation, usePatientListQuery } from '../../mutations/patient_mutations'
import { Label } from '../Label'
import { MultiSearchWithMapping, SimpleSearchWithMapping } from '../../utils/simpleSearch'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { HideableContentSection } from '@helpwave/common/components/HideableContentSection'

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
  search: string,
  bed: string
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
    search: 'Search',
    bed: 'Bed',
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
    search: 'Suchen',
    bed: 'Bett',
  }
}

export type PatientListOpenedSectionsType = {
  active: boolean,
  unassigned: boolean,
  discharged: boolean
}

export const defaultPatientListOpenedSections: PatientListOpenedSectionsType = {
  active: true,
  unassigned: true,
  discharged: false
}

export type PatientListProps = {
  onDischarge?: (patient: PatientDTO) => void,
  initialOpenedSections?:PatientListOpenedSectionsType,
  width?: number
}

/**
 * The right side of the ward/[uuid].tsx page showing the detailed information about the patients in the ward
 */
export const PatientList = ({
  language,
  initialOpenedSections = defaultPatientListOpenedSections
}: PropsWithLanguage<PatientListTranslation, PatientListProps>) => {
  const translation = useTranslation(language, defaultPatientListTranslations)
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = usePatientListQuery()
  const dischargeMutation = usePatientDischargeMutation()

  const activeLabelText = (patient: PatientWithBedAndRoomDTO) => `${patient.room.name} - ${patient.bed.name}`

  const filteredActive = !data ? [] : MultiSearchWithMapping(search, data.active, value => [value.name, activeLabelText(value)])
  const filteredUnassigned = !data ? [] : SimpleSearchWithMapping(search, data.unassigned, value => value.name)
  const filteredDischarged = !data ? [] : SimpleSearchWithMapping(search, data.discharged, value => value.name)

  return (
    <div className={tw('relative flex flex-col py-4 px-6')}>
      <div className={tw('flex flex-row gap-x-2 items-center mb-6')}>
        <Span type="subsectionTitle" className={tw('pr-4')}>{translation.patients}</Span>
        <Input placeholder={translation.search} value={search} onChange={setSearch} className={tw('h-9')}/>
        <Button
          className={tw('whitespace-nowrap')}
          color="positive"
          onClick={() => {
            // TODO open add patient screen
          }}
        >
          {translation.addPatient}
        </Button>
      </div>
      <LoadingAndErrorComponent
        hasError={isError || !data}
        isLoading={isLoading}
        errorProps={{ classname: tw('min-h-[400px] border-2 border-gray-600 rounded-xl') }}
        loadingProps={{ classname: tw('min-h-[400px] border-2 border-gray-600 rounded-xl') }}
      >
        <div className={tw('flex flex-col gap-y-4 mb-8')}>
          {filteredActive.length >= 0 && (
            <HideableContentSection
              initiallyOpen={initialOpenedSections?.active}
              disabled={filteredActive.length <= 0}
              header={<Span type="accent">{`${translation.active} (${filteredActive.length})`}</Span>}
            >
              {filteredActive.map(patient => (
                <div key={patient.id} className={tw('flex flex-row pt-2 border-b-2 justify-between items-center')}>
                  <Span className={tw('font-space font-bold w-1/3 text-ellipsis')}>{patient.name}</Span>
                  <div className={tw('flex flex-row flex-1 justify-between items-center')}>
                    <Label name={activeLabelText(patient)} color="blue"/>
                    <Button color="negative" variant="textButton" onClick={() => {
                      dischargeMutation.mutate(patient.id)
                    }}>
                      {translation.discharge}
                    </Button>
                  </div>
                </div>
              ))}
            </HideableContentSection>
          )}
          {filteredUnassigned.length >= 0 && (
            <HideableContentSection
              initiallyOpen={initialOpenedSections?.unassigned}
              disabled={filteredUnassigned.length <= 0}
              header={ <Span type="accent" className={tw('text-hw-label-yellow-text')}>{`${translation.unassigned} (${filteredUnassigned.length})`}</Span>}
            >
              {filteredUnassigned.map(patient => (
                <div key={patient.id} className={tw('flex flex-row pt-2 border-b-2 items-center')}>
                  <Span className={tw('font-space font-bold w-1/3 text-ellipsis')}>{patient.name}</Span>
                  <div className={tw('flex flex-row flex-1 justify-between items-center')}>
                    <Label name={`${translation.unassigned}`} color="yellow"/>
                    <Button color="negative" variant="textButton" onClick={() => {
                      dischargeMutation.mutate(patient.id)
                    }}>
                      {translation.discharge}
                    </Button>
                  </div>
                </div>
              ))}
            </HideableContentSection>
          )}
          {filteredDischarged.length >= 0 && (
            <HideableContentSection
              initiallyOpen={initialOpenedSections?.discharged}
              disabled={filteredDischarged.length <= 0}
              header={<Span type="accent">{`${translation.discharged} (${filteredDischarged.length})`}</Span>}
            >
              {filteredDischarged.map(patient => (
                <div key={patient.id} className={tw('flex flex-row pt-2 border-b-2 justify-between items-center')}>
                  <Span className={tw('font-space font-bold')}>{patient.name}</Span>
                  { /* TODO implement when backend endpoint exists
                  <Button color="negative" variant="textButton" onClick={() => {
                    // TODO delete
                  }}>
                    {translation.delete}
                  </Button>
                  */}
                </div>
              ))}
            </HideableContentSection>
          )}
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
