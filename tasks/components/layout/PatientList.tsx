import { useContext, useEffect, useState } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user-input/Input'
import { MultiSearchWithMapping, SimpleSearchWithMapping } from '@helpwave/common/util/simpleSearch'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { HideableContentSection } from '@helpwave/common/components/HideableContentSection'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Chip } from '@helpwave/common/components/ChipList'
import {
  usePatientDischargeMutation,
  usePatientListQuery,
  useReadmitPatientMutation
} from '@helpwave/api-services/mutations/tasks/patient_mutations'
import type {
  PatientDTO,
  PatientMinimalDTO,
  PatientWithBedAndRoomDTO
} from '@helpwave/api-services/types/tasks/patient'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { Draggable, Droppable } from '../dnd-kit-instances/patients'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import { PatientDischargeModal } from '@/components/modals/PatientDischargeModal'
import { AddPatientModal } from '@/components/modals/AddPatientModal'

type PatientListTranslation = {
  patients: string,
  active: string,
  unassigned: string,
  discharged: string,
  readmit: string,
  discharge: string,
  dischargeConfirmText: string,
  delete: string,
  deleteConfirmText: string,
  deleteDescriptionText: string,
  addPatient: string,
  search: string,
  bed: string,
  otherWard: string
}

const defaultPatientListTranslations: Record<Languages, PatientListTranslation> = {
  en: {
    patients: 'Patients',
    active: 'Assigned',
    unassigned: 'Unassigned',
    discharged: 'Discharged Patients',
    discharge: 'Discharge',
    readmit: 'Readmit',
    dischargeConfirmText: 'Do you really want to discharge the patient?',
    delete: 'Delete',
    deleteConfirmText: 'Do you really want to delete the patient?',
    deleteDescriptionText: 'All information about the patient will be deleted and you will have to register the patient again.',
    addPatient: 'Add Patient',
    search: 'Search',
    bed: 'Bed',
    otherWard: 'Other Ward',
  },
  de: {
    patients: 'Patienten',
    active: 'Zugeordnet',
    unassigned: 'Nicht zugeordnet',
    discharged: 'Entlassene Patienten',
    discharge: 'Entlassen',
    readmit: 'Wiederaufnehmen',
    dischargeConfirmText: 'Willst du den Patienten wirklich entlassen?',
    delete: 'Löschen',
    deleteConfirmText: 'Willst du den Patienten wirklich löschen?',
    deleteDescriptionText: 'Alle Informationen bezüglich des Patienten werden gelöschet und der Patient müsste erneut registriert werden.',
    addPatient: 'Patient hinzufügen',
    search: 'Suchen',
    bed: 'Bett',
    otherWard: 'Andere Station',
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
  wardId: string,
  initialOpenedSections?: PatientListOpenedSectionsType,
  width?: number
}

/**
 * The right side of the ward/[wardId].tsx page showing the detailed information about the patients in the ward
 */
export const PatientList = ({
  overwriteTranslation,
  wardId,
  initialOpenedSections = defaultPatientListOpenedSections
}: PropsForTranslation<PatientListTranslation, PatientListProps>) => {
  const translation = useTranslation(defaultPatientListTranslations, overwriteTranslation)
  const [search, setSearch] = useState('')
  const {
    state: context,
    updateContext
  } = useContext(WardOverviewContext)
  const {
    data,
    isLoading,
    isError,
    refetch: refetchPatientListQuery
  } = usePatientListQuery(wardId) // TODO: is this the right organizationId?; related: https://github.com/helpwave/web/issues/793
  const [isShowingAddPatientModal, setIsShowingAddPatientModal] = useState(0)
  const dischargeMutation = usePatientDischargeMutation()
  const readmitPatientMutation = useReadmitPatientMutation()
  const [dischargingPatient, setDischargingPatient] = useState<PatientMinimalDTO>()
  const [deletePatient, setDeletePatient] = useState<PatientMinimalDTO>()

  const { observeAttribute } = useUpdates()
  useEffect(() => {
    const subscription = observeAttribute('aggregateType', 'patient').subscribe(() => refetchPatientListQuery())
    return () => {
      subscription.unsubscribe()
    }
  }, [observeAttribute, refetchPatientListQuery])

  const activeLabelText = (patient: PatientWithBedAndRoomDTO) => patient.room.wardId === wardId
    ? `${patient.room.name} - ${patient.bed.name}`
    : translation.otherWard

  const filteredActive = !data ? [] : MultiSearchWithMapping(search, data.active, value => [value.name, activeLabelText(value)])
  const filteredUnassigned = !data ? [] : SimpleSearchWithMapping(search, data.unassigned, value => value.name)
  const filteredDischarged = !data ? [] : SimpleSearchWithMapping(search, data.discharged, value => value.name)

  return (
    <div className={tw('relative flex flex-col py-4 px-6')}>
      <ConfirmDialog
        id="patientList-DeleteDialog"
        isOpen={!!deletePatient}
        titleText={translation.deleteConfirmText}
        descriptionText={translation.deleteDescriptionText}
        onConfirm={() => {
          if (deletePatient) {
            // deletePatientMutation.mutate(deletePatient.id)
          }
          setDeletePatient(undefined)
        }}
        confirmType="negative"
        onBackgroundClick={() => {
          setDeletePatient(undefined)
        }}
        onCancel={() => setDeletePatient(undefined)}
        onCloseClick={() => setDeletePatient(undefined)}
      >

      </ConfirmDialog>
      <PatientDischargeModal
        id="patientList-DischargeDialog"
        isOpen={!!dischargingPatient}
        onConfirm={() => {
          if (dischargingPatient) {
            dischargeMutation.mutate(dischargingPatient.id)
          }
          setDischargingPatient(undefined)
        }}
        onBackgroundClick={() => setDischargingPatient(undefined)}
        onCancel={() => setDischargingPatient(undefined)}
        onCloseClick={() => setDischargingPatient(undefined)}
        patient={dischargingPatient}
      />
      <AddPatientModal
        id="patientList-AddPatientModal"
        key={isShowingAddPatientModal}
        isOpen={isShowingAddPatientModal !== 0}
        onConfirm={() => setIsShowingAddPatientModal(0)}
        onCancel={() => setIsShowingAddPatientModal(0)}
        onCloseClick={() => setIsShowingAddPatientModal(0)}
        onBackgroundClick={() => setIsShowingAddPatientModal(0)}
        wardId={context.wardId}
      />
      <div className={tw('flex flex-row gap-x-2 items-center')}>
        <Span type="subsectionTitle" className={tw('pr-4')}>{translation.patients}</Span>
        <Input placeholder={translation.search} value={search} onChange={setSearch} className={tw('h-9')}/>
        <Button
          className={tw('whitespace-nowrap')}
          color="hw-positive"
          onClick={() => {
            setIsShowingAddPatientModal(Math.random() * 100000000 + 1)
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
          <div className={tx('p-2 border-2 border-transparent rounded-xl')}>
            <HideableContentSection
              initiallyOpen={initialOpenedSections?.active}
              disabled={filteredActive.length <= 0}
              header={<Span type="accent">{`${translation.active} (${filteredActive.length})`}</Span>}
            >
              {filteredActive.map(patient => (
                <Draggable id={patient.id + 'patientList'} key={patient.id} data={{
                  patient: {
                    id: patient.id,
                    name: patient.name
                  },
                  discharged: false
                }}>
                  {() => (
                    <div
                      className={tw('flex flex-row pt-2 border-b-2 justify-between items-center cursor-pointer')}
                      onClick={() => updateContext({
                        ...context,
                        patientId: patient.id,
                        roomId: patient.room.id,
                        bedId: patient.bed.id
                      })}
                    >
                      <Span className={tw('font-space font-bold w-1/3 text-ellipsis')}>{patient.name}</Span>
                      <div className={tw('flex flex-row flex-1 justify-between items-center')}>
                        <Chip color="hw-label-blue" variant="fullyRounded">
                          {activeLabelText(patient)}
                        </Chip>
                        <Button color="hw-negative" variant="text" onClick={event => {
                          event.stopPropagation()
                          setDischargingPatient(patient)
                        }}>
                          {translation.discharge}
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </HideableContentSection>
          </div>
          <Droppable id="patientListUnassigned" data={{ patientListSection: 'unassigned' }}>
            {({ isOver }) => (
              <div className={tx('p-2 border-2 border-dashed rounded-xl', {
                'border-hw-primary-700': isOver,
                'border-transparent': !isOver
              })}>
                <HideableContentSection
                  initiallyOpen={initialOpenedSections?.unassigned}
                  disabled={filteredUnassigned.length <= 0}
                  header={(
                    <Span type="accent" className={tw('text-hw-label-yellow-400')}>
                      {`${translation.unassigned} (${filteredUnassigned.length})`}
                    </Span>
                  )}
                >
                  {filteredUnassigned.map((patient) => (
                    <Draggable id={patient.id} key={patient.id} data={{
                      patient,
                      discharged: false
                    }}>
                      {() => (
                        <div
                          key={patient.id}
                          className={tw('flex flex-row pt-2 border-b-2 items-center cursor-pointer')}
                          onClick={() => updateContext({
                            wardId: context.wardId,
                            patientId: patient.id
                          })}
                        >
                          <Span className={tw('font-space font-bold w-1/3 text-ellipsis')}>{patient.name}</Span>
                          <div className={tw('flex flex-row flex-1 justify-between items-center')}>
                            <Chip color="hw-label-yellow" variant="fullyRounded">
                              {`${translation.unassigned}`}
                            </Chip>
                            <Button color="hw-negative" variant="text" onClick={event => {
                              event.stopPropagation()
                              setDischargingPatient(patient)
                            }}>
                              {translation.discharge}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </HideableContentSection>
              </div>
            )}
          </Droppable>
          <Droppable id="patientListDischarged" data={{ patientListSection: 'discharged' }}>
            {({ isOver }) => (
              <div className={tx('p-2 border-2 border-dashed rounded-xl', {
                'border-hw-primary-700': isOver,
                'border-transparent': !isOver
              })}>
                <HideableContentSection
                  initiallyOpen={initialOpenedSections?.discharged}
                  disabled={filteredDischarged.length <= 0}
                  header={<Span type="accent">{`${translation.discharged} (${filteredDischarged.length})`}</Span>}
                >
                  {filteredDischarged.map(patient => (
                    <Draggable id={patient.id} key={patient.id} data={{
                      patient,
                      discharged: true
                    }}>
                      {() => (
                        <div
                          key={patient.id}
                          className={tw('flex flex-row pt-2 border-b-2 justify-between items-center')}
                          onClick={() => updateContext({
                            wardId: context.wardId,
                            patientId: patient.id
                          })}
                        >
                          <Span className={tw('font-space font-bold')}>{patient.name}</Span>
                          <div className={tw('flex flex-row gap-x-4')}>
                            <Button variant="text" onClick={event => {
                              event.stopPropagation()
                              readmitPatientMutation.mutate(patient.id)
                            }}>
                              {translation.readmit}
                            </Button>
                            <Button
                              color="hw-negative"
                              variant="text" onClick={event => {
                                event.stopPropagation()
                                setDeletePatient(patient)
                              }}
                              // TODO enable when patient delete is possible again
                              disabled={true}
                            >
                              {translation.delete}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </HideableContentSection>
              </div>
            )}
          </Droppable>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
