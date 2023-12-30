import { createContext, useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Span } from '@helpwave/common/components/Span'
import { DndContext, type DragEndEvent, type DragStartEvent } from '@/components/dnd-kit-instances/patients'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PatientDetail } from '@/components/layout/PatientDetails'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { WardRoomList } from '@/components/layout/WardRoomList'
import { PatientList } from '@/components/layout/PatientList'
import type { PatientDTO, PatientMinimalDTO } from '@/mutations/patient_mutations'
import {
  useAssignBedMutation,
  usePatientCreateMutation,
  usePatientDischargeMutation,
  useReadmitPatientMutation,
  useUnassignMutation
} from '@/mutations/patient_mutations'
import { DragCard } from '@/components/cards/DragCard'
import type { BedWithPatientWithTasksNumberDTO } from '@/mutations/bed_mutations'
import { PatientCard } from '@/components/cards/PatientCard'
import { useWardQuery } from '@/mutations/ward_mutations'
import { useOrganizationQuery } from '@/mutations/organization_mutations'
import { useRouteParameters } from '@/hooks/useRouteParameters'

type WardOverviewTranslation = {
  beds: string,
  roomOverview: string,
  organization: string,
  ward: string,
  room: string,
  addPatientDialogTitle: string
}

const defaultWardOverviewTranslation = {
  en: {
    beds: 'Betten',
    roomOverview: 'Ward Overview',
    organization: 'Organization',
    ward: 'Ward',
    room: 'Room',
    addPatientDialogTitle: 'Do you want to add a new patient?'
  },
  de: {
    beds: 'Bett',
    roomOverview: 'Stationsübersicht',
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
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
  organizationId?: string
}

const emptyWardOverviewContextState = {
  wardId: '',
  organizationId: '',
}

export type WardOverviewContextType = {
  state: WardOverviewContextState,
  updateContext: (context: WardOverviewContextState) => void
}

export const WardOverviewContext = createContext<WardOverviewContextType>({
  state: emptyWardOverviewContextState,
  updateContext: () => undefined
})

const WardOverview: NextPage = ({ language }: PropsWithLanguage<WardOverviewTranslation>) => {
  const translation = useTranslation(language, defaultWardOverviewTranslation)
  // TODO: could we differentiate between the two using two different states?
  const [draggedPatient, setDraggedPatient] = useState<{
    patient?: PatientMinimalDTO,
    bed?: BedWithPatientWithTasksNumberDTO
  }>()
  const wardId = useRouteParameters<'wardId'>().wardId
  const ward = useWardQuery(wardId).data

  // TODO: is using '' as an org id a good idea?
  const organizationId = ward?.organizationId ?? ''
  const { data: organization } = useOrganizationQuery(organizationId)

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardId
  })
  const [draggingRoomId, setDraggingRoomId] = useState<string>()
  const [draggingBedId, setDraggingBedId] = useState<string>()

  const assignBedMutation = useAssignBedMutation(bed => {
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
  })
  const unassignMutation = useUnassignMutation()
  const dischargeMutation = usePatientDischargeMutation()
  const readmitPatientMutation = useReadmitPatientMutation(patientId => {
    if (draggingBedId) {
      assignBedMutation.mutate({
        id: draggingBedId,
        patientId
      })
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
          readmitAndAssignPatient(patientId, target.bed.id).then()
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

  const createMutation = usePatientCreateMutation(organizationId, patient => {
    const updatedContext = contextState
    updatedContext.patient = patient

    if (contextState.bedId) {
      assignBedMutation.mutate({
        id: contextState.bedId,
        patientId: patient.id
      })
    }
    setContextState(updatedContext)
  })

  return (
    <PageWithHeader
      crumbs={[
        {
          display: organization?.shortName ?? translation.organization,
          link: ward ? `/organizations?organizationId=${ward.organizationId}` : '/organizations'
        },
        {
          display: ward?.name ?? translation.ward,
          link: ward ? `/organizations/${ward.organizationId}?wardId=${wardId}` : '/organizations'
        },
        {
          display: translation.room,
          link: `/ward/${wardId}`
        }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.roomOverview)}</title>
      </Head>
      <ConfirmDialog
        id="WardOverview-AddPatientDialog"
        isOpen={isShowingPatientDialog}
        titleText={translation.addPatientDialogTitle}
        onConfirm={() => {
          if (contextState.patient) {
            createMutation.mutate(contextState.patient)
          } else {
            setContextState({
              ...emptyWardOverviewContextState,
              wardId: contextState.wardId,
              patient: undefined
            })
          }
        }}
        onCancel={() => {
          setContextState({
            ...emptyWardOverviewContextState,
            wardId: contextState.wardId,
            patient: undefined
          })
        }}
        onCloseClick={() => {
          setContextState({
            ...emptyWardOverviewContextState,
            wardId: contextState.wardId,
            patient: undefined
          })
        }}
        onBackgroundClick={() => {
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
              right: { min: '580px' },
              left: { min: '33%' }
            }}
            baseLayoutValue="-580px"
            left={() => (<WardRoomList key={wardId} />)}
            right={width =>
              isShowingPatientList ? (
                <PatientList width={width} wardId={wardId} />
              ) :
                contextState.patientId && (
                  <div>
                    <PatientDetail
                      key={contextState.patient?.id}
                      wardId={wardId}
                      width={width}
                    />
                  </div>
                )
            }
          />
          {/* TODO Later reenable the dropAnimation */}
          <DragOverlay style={{ width: '200px' }} dropAnimation={null}>
            {draggedPatient && (draggedPatient.patient ? (
              <DragCard
                cardDragProperties={{ isDragging: true }}><Span>{draggedPatient.patient.name}</Span></DragCard>
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
