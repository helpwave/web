import { createContext, useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { ConfirmModal, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import { useWardQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import {
  useAssignBedMutation,
  usePatientCreateMutation,
  usePatientDischargeMutation,
  useReadmitPatientMutation,
  useUnassignMutation
} from '@helpwave/api-services/mutations/tasks/patient_mutations'
import type { PatientDTO, PatientMinimalDTO } from '@helpwave/api-services/types/tasks/patient'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { DndContext, type DragEndEvent, type DragStartEvent } from '@/components/dnd-kit-instances/patients'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PatientDetail } from '@/components/layout/PatientDetails'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { WardRoomList } from '@/components/layout/WardRoomList'
import { PatientList } from '@/components/layout/PatientList'
import { DragCard } from '@/components/cards/DragCard'
import { PatientCard } from '@/components/cards/PatientCard'
import { useRouteParameters } from '@/hooks/useRouteParameters'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'

type WardOverviewTranslation = {
  beds: string,
  roomOverview: string,
  organization: string,
  ward: string,
  rooms: string,
  addPatientDialogTitle: string,
}

const defaultWardOverviewTranslation = {
  en: {
    beds: 'Betten',
    roomOverview: 'Ward Overview',
    organization: 'Organization',
    ward: 'Ward',
    rooms: 'Rooms',
    addPatientDialogTitle: 'Do you want to add a new patient?'
  },
  de: {
    beds: 'Bett',
    roomOverview: 'Stationsübersicht',
    organization: 'Organisation',
    ward: 'Station',
    rooms: 'Räume',
    addPatientDialogTitle: 'Willst du einen neuen Patienten hinzufügen?'
  }
}

export type WardOverviewContextState = {
  /**
   patient set means creating patient
   patientId is the current patient
   */
  patient?: PatientDTO,
  patientId?: string,
  bedId?: string,
  roomId?: string,
  wardId: string,
  organizationId?: string,
}

const emptyWardOverviewContextState = {
  wardId: '',
  organizationId: '',
}

export type WardOverviewContextType = {
  state: WardOverviewContextState,
  updateContext: (context: WardOverviewContextState) => void,
}

export const WardOverviewContext = createContext<WardOverviewContextType>({
  state: emptyWardOverviewContextState,
  updateContext: () => undefined
})

const WardOverview: NextPage = ({ overwriteTranslation }: PropsForTranslation<WardOverviewTranslation>) => {
  const translation = useTranslation([defaultWardOverviewTranslation], overwriteTranslation)


  // TODO: could we differentiate between the two using two different states?
  const [draggedPatient, setDraggedPatient] = useState<{
    patient?: PatientMinimalDTO,
    bed?: BedWithPatientWithTasksNumberDTO,
  }>()
  const wardId = useRouteParameters<'wardId'>().wardId
  const { data: ward, refetch } = useWardQuery(wardId)
  const { organization } = useAuth()

  const { observeAttribute } = useUpdates()
  useEffect(() => {
    const subscription = observeAttribute('aggregateType', 'task').subscribe(() => refetch())
    return () => {
      subscription.unsubscribe()
    }
  }, [observeAttribute, refetch])

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardId
  })
  const [draggingRoomId, setDraggingRoomId] = useState<string>()
  const [draggingBedId, setDraggingBedId] = useState<string>()

  const assignBedMutation = useAssignBedMutation({
    onSuccess: (bed) => {
      if (draggingRoomId) {
        setContextState({
          ...contextState,
          bedId: bed.id,
          patientId: bed.patientId,
          roomId: draggingRoomId,
          patient: undefined
        })
      } else {
        setContextState({
          ...contextState,
          bedId: bed.id,
          patientId: bed.patientId,
          patient: undefined
        })
      }

      setDraggingRoomId(undefined)
    }
  })
  const unassignMutation = useUnassignMutation()
  const dischargeMutation = usePatientDischargeMutation()
  const readmitPatientMutation = useReadmitPatientMutation({
    onSuccess: (_, variables, _2) => {
      if (draggingBedId) {
        assignBedMutation.mutate({
          id: draggingBedId,
          patientId: variables
        })
      }
    }
  })

  const sensorOptions = { activationConstraint: { distance: 8 } }
  const sensors = useSensors(
    useSensor(MouseSensor, sensorOptions),
    useSensor(TouchSensor, sensorOptions)
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    const source = active.data.current

    // TODO: I am unfamiliar with the code base and types, is this a good way of dealing with this?
    if (!source) {
      return
    }

    if ('bed' in source) {
      setDraggedPatient({ bed: source.bed })
    } else {
      setDraggedPatient({ patient: source.patient })
    }
  }, [])

  const readmitAndAssignPatient = useCallback(async (patientId: string, bedId: string) => {
    setDraggingBedId(bedId)
    readmitPatientMutation.mutate(patientId)
  }, [readmitPatientMutation])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {
      active,
      over
    } = event
    const source = active.data.current
    const target = over?.data.current

    const patientId = draggedPatient?.patient?.id ?? draggedPatient?.bed?.patient?.id ?? ''

    if (source && target) {
      if ('patientListSection' in target) {
        // Moving inside of patient list
        if (target.patientListSection === 'unassigned') {
          if ('discharged' in source && source.discharged) {
            readmitPatientMutation.mutate(patientId)
          }
          unassignMutation.mutate(patientId) // TODO: is this correct?, doing two mutations for a patient if previously discharged?
        } else if (target.patientListSection === 'discharged') { // TODO: can we unify the formats for patients PREVIOUSLY having been discharged and patients BEING discharged? (boolean vs.patientListSection)
          dischargeMutation.mutate(patientId)
        }
      } else {
        // Moving on bed cards
        setDraggingRoomId(target.room.id)
        if ('discharged' in source && source.discharged) {
          readmitAndAssignPatient(patientId, target.bed.id).catch(console.error)
        } else {
          assignBedMutation.mutate({
            id: target.bed.id,
            patientId
          })
        }
      }
    }

    setDraggedPatient(undefined)
  }, [assignBedMutation, unassignMutation, readmitPatientMutation, readmitAndAssignPatient, dischargeMutation, draggedPatient])

  const handleDragCancel = useCallback(() => {
    setDraggedPatient(undefined)
  }, [])

  const isShowingPatientDialog = !!contextState.patient
  const isShowingPatientList = contextState.patientId === undefined || isShowingPatientDialog

  useEffect(() => {
    setContextState({ wardId })
  }, [wardId])

  const createPatientMutation = usePatientCreateMutation()

  // TODO: can we somehow assert that the patient is not undefined here?
  const createPatient = () => contextState.patient && createPatientMutation.mutateAsync(contextState.patient)
    .then((patient) => {
      // TODO: is it a good idea to have this much state in one object?, also this shouldn't be called context I think
      setContextState({
        ...contextState,
        patient,
      })

      if (contextState.bedId) {
        return assignBedMutation.mutateAsync({
          id: contextState.bedId,
          patientId: patient.id
        })
      }
    })

  return (
    <PageWithHeader
      crumbs={[
        {
          display: organization?.name ?? translation('organization'),
          link: `/organizations/?organizationId=${organization?.id}`
        },
        {
          display: ward?.name ?? translation('ward'),
          link: `/organizations/${organization?.id ?? ''}?wardId=${wardId}`
        },
        {
          display: translation('rooms'),
          link: `/ward/${wardId}`
        }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation('roomOverview'))}</title>
      </Head>
      <ConfirmModal
        isOpen={isShowingPatientDialog}
        headerProps={{ titleText: translation('addPatientDialogTitle') }}
        onConfirm={() => {
          if (contextState.patient) {
            createPatient()
          } else {
            setContextState({
              ...emptyWardOverviewContextState,
              wardId: contextState.wardId,
              patient: undefined
            })
          }
        }}
        onDecline={() => {
          setContextState({
            ...emptyWardOverviewContextState,
            wardId: contextState.wardId,
            patient: undefined
          })
        }}
        onCancel={() => {
          setContextState({
            ...emptyWardOverviewContextState,
            wardId: contextState.wardId,
            patient: undefined
          })
        }}
      />
      <WardOverviewContext.Provider value={{
        state: contextState,
        updateContext: setContextState
      }}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <TwoColumn
            disableResize={false}
            constraints={{
              right: { min: '650px' },
              left: { min: '33%' }
            }}
            baseLayoutValue="-580px"
            left={() => (<WardRoomList key={wardId}/>)}
            right={width =>
              isShowingPatientList ? (
                  <PatientList width={width} wardId={wardId}/>
                ) :
                contextState.patientId && (
                  <PatientDetail
                    key={contextState.patient?.id}
                    wardId={wardId}
                    width={width}
                  />
                )
            }
          />
          {/* TODO Later reenable the dropAnimation */}
          <DragOverlay style={{ width: '200px' }} dropAnimation={null}>
            {draggedPatient && (draggedPatient.patient ? (
                  <DragCard cardDragProperties={{ isDragging: true }}>
                    <span>{draggedPatient.patient.name}</span>
                  </DragCard>
                )
                : draggedPatient.bed && draggedPatient.bed.patient && (
                <PatientCard
                  bedName={draggedPatient.bed.name}
                  patientName={draggedPatient.bed.patient.name}
                  unscheduledTasks={draggedPatient.bed.patient.tasksUnscheduled}
                  inProgressTasks={draggedPatient.bed.patient.tasksInProgress}
                  doneTasks={draggedPatient.bed.patient.tasksDone}
                />
              )
            )}
          </DragOverlay>
        </DndContext>
      </WardOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardOverview
