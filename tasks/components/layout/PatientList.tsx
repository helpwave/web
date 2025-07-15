import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { ExpandableUncontrolled } from '@helpwave/hightide'
import {
  Chip,
  ConfirmModal,
  Input,
  LoadingAndErrorComponent,
  MultiSearchWithMapping,
  type PropsForTranslation,
  SimpleSearchWithMapping,
  SolidButton,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import {
  usePatientDischargeMutation,
  usePatientListQuery,
  useReadmitPatientMutation
} from '@helpwave/api-services/mutations/tasks/patient_mutations'
import type { PatientDTO, PatientMinimalDTO, PatientWithBedAndRoomDTO } from '@helpwave/api-services/types/tasks/patient'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { Draggable, Droppable } from '../dnd-kit-instances/patients'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import { PatientDischargeModal } from '@/components/modals/PatientDischargeModal'
import { AddPatientModal } from '@/components/modals/AddPatientModal'
import { ColumnTitle } from '@/components/ColumnTitle'

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
  otherWard: string,
}

const defaultPatientListTranslations: Translation<PatientListTranslation> = {
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
  discharged: boolean,
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
  width?: number,
}

/**
 * The right side of the ward/[wardId].tsx page showing the detailed information about the patients in the ward
 */
export const PatientList = ({
                              overwriteTranslation,
                              wardId,
                              initialOpenedSections = defaultPatientListOpenedSections
                            }: PropsForTranslation<PatientListTranslation, PatientListProps>) => {
  const translation = useTranslation([defaultPatientListTranslations], overwriteTranslation)
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
    : translation('otherWard')
  const filteredActive = !data ? [] : MultiSearchWithMapping(search, data.active, value => [value.name, activeLabelText(value)])
  const filteredUnassigned = !data ? [] : SimpleSearchWithMapping(search, data.unassigned, value => value.name)
  const filteredDischarged = !data ? [] : SimpleSearchWithMapping(search, data.discharged, value => value.name)

  return (
    <div className="relative col py-4 px-6">
      <ConfirmModal
        isOpen={!!deletePatient}
        onConfirm={() => {
          if (deletePatient) {
            // deletePatientMutation.mutate(deletePatient.id)
          }
          setDeletePatient(undefined)
        }}
        confirmType="negative"
        onCancel={() => setDeletePatient(undefined)}
        headerProps={{
          titleText: translation('deleteConfirmText'),
          descriptionText: translation('deleteDescriptionText')
        }}
      />
      <PatientDischargeModal
        isOpen={!!dischargingPatient}
        onConfirm={() => {
          if (dischargingPatient) {
            dischargeMutation.mutate(dischargingPatient.id)
          }
          setDischargingPatient(undefined)
        }}
        onCancel={() => setDischargingPatient(undefined)}
        patient={dischargingPatient}
      />
      <AddPatientModal
        key={isShowingAddPatientModal}
        isOpen={isShowingAddPatientModal !== 0}
        onConfirm={() => setIsShowingAddPatientModal(0)}
        onCancel={() => setIsShowingAddPatientModal(0)}
        wardId={context.wardId}
      />
      <ColumnTitle
        title={translation('patients')}
        actions={(
          <div className="row gap-x-2">
            <Input placeholder={translation('search')} value={search} onChangeText={setSearch} className="h-10"/>
            <SolidButton
              className="whitespace-nowrap"
              color="positive"
              onClick={() => {
                setIsShowingAddPatientModal(Math.random() * 100000000 + 1)
              }}
            >
              {translation('addPatient')}
            </SolidButton>
          </div>
        )}
      />
      <LoadingAndErrorComponent
        hasError={isError || !data}
        isLoading={isLoading}
        className="min-h-128"
        minimumLoadingDuration={200}
      >
        <div className="col gap-y-4 mb-8">
          <ExpandableUncontrolled
            isExpanded={initialOpenedSections?.active}
            disabled={filteredActive.length <= 0}
            label={<span className="textstyle-accent">{`${translation('active')} (${filteredActive.length})`}</span>}
            className={clsx('border-2 border-transparent bg-transparent !shadow-none')}
            headerClassName="bg-transparent"
          >
            {filteredActive.map(patient => (
              <Draggable
                id={patient.id + 'patientList'}
                key={patient.id}
                data={{
                  patient: {
                    id: patient.id,
                    name: patient.name
                  },
                  discharged: false
                }}
                className="not-last:border-b-2 not-last:pb-2 border-b-gray-300"
              >
                {() => (
                  <div
                    className="row justify-between items-center cursor-pointer"
                    onClick={() => updateContext({
                      ...context,
                      patientId: patient.id,
                      roomId: patient.room.id,
                      bedId: patient.bed.id
                    })}
                  >
                    <span className="textstyle-title-sm w-1/3 text-ellipsis">{patient.name}</span>
                    <div className="row flex-1 justify-between items-center">
                      <Chip color="blue" variant="fullyRounded" className="min-w-40 justify-center">
                        {activeLabelText(patient)}
                      </Chip>
                      <TextButton color="negative" onClick={event => {
                        event.stopPropagation()
                        setDischargingPatient(patient)
                      }}>
                        {translation('discharge')}
                      </TextButton>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </ExpandableUncontrolled>
          <Droppable id="patientListUnassigned" data={{ patientListSection: 'unassigned' }}>
            {({ isOver }) => (
              <ExpandableUncontrolled
                isExpanded={initialOpenedSections?.unassigned}
                disabled={filteredUnassigned.length <= 0}
                label={(
                  <span className="textstyle-accent text-tag-yellow-text">
                      {`${translation('unassigned')} (${filteredUnassigned.length})`}
                  </span>
                )}
                className={clsx('border-2 border-dashed bg-transparent !shadow-none', {
                  'border-primary': isOver,
                  'border-transparent': !isOver
                })}
                headerClassName="bg-transparent"
              >
                {filteredUnassigned.map((patient) => (
                  <Draggable
                    id={patient.id}
                    key={patient.id}
                    data={{
                      patient,
                      discharged: false
                    }}
                    className="not-last:border-b-2 not-last:pb-2 border-b-gray-300"
                  >
                    {() => (
                      <div
                        key={patient.id}
                        className="row rounded items-center cursor-pointer"
                        onClick={() => updateContext({
                          wardId: context.wardId,
                          patientId: patient.id
                        })}
                      >
                        <span className="textstyle-title-sm w-1/3 text-ellipsis">{patient.name}</span>
                        <div className="row flex-1 justify-between items-center">
                          <Chip color="yellow" variant="fullyRounded" className="min-w-40 justify-center">
                            {`${translation('unassigned')}`}
                          </Chip>
                          <TextButton color="negative" onClick={event => {
                            event.stopPropagation()
                            setDischargingPatient(patient)
                          }}>
                            {translation('discharge')}
                          </TextButton>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </ExpandableUncontrolled>
            )}
          </Droppable>
          <Droppable id="patientListDischarged" data={{ patientListSection: 'discharged' }}>
            {({ isOver }) => (
              <ExpandableUncontrolled
                isExpanded={initialOpenedSections?.discharged}
                disabled={filteredDischarged.length <= 0}
                label={(
                  <span className="textstyle-accent">
                    {`${translation('discharged')} (${filteredDischarged.length})`}
                  </span>
                )}
                className={clsx('border-2 border-dashed bg-transparent !shadow-none', {
                  'border-primary': isOver,
                  'border-transparent': !isOver
                })}
                headerClassName="bg-transparent"
              >
                {filteredDischarged.map(patient => (
                  <Draggable
                    id={patient.id}
                    key={patient.id}
                    data={{
                      patient,
                      discharged: true
                    }}
                    className="not-last:border-b-2 not-last:pb-2 border-b-gray-300"
                  >
                    {() => (
                      <div
                        key={patient.id}
                        className="row justify-between items-center"
                        onClick={() => updateContext({
                          wardId: context.wardId,
                          patientId: patient.id
                        })}
                      >
                        <span className="textstyle-title-sm">{patient.name}</span>
                        <div className="row gap-x-4">
                          <TextButton onClick={event => {
                            event.stopPropagation()
                            readmitPatientMutation.mutate(patient.id)
                          }}>
                            {translation('readmit')}
                          </TextButton>
                          <TextButton
                            color="negative"
                            onClick={event => {
                              event.stopPropagation()
                              setDeletePatient(patient)
                            }}
                            // TODO enable when patient delete is possible again
                            disabled={true}
                          >
                            {translation('delete')}
                          </TextButton>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </ExpandableUncontrolled>
            )}
          </Droppable>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
