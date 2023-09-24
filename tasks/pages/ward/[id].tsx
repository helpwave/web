import { createContext, useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import { PatientDetail } from '../../components/layout/PatientDetails'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { WardRoomList } from '../../components/layout/WardRoomList'
import { PatientList } from '../../components/layout/PatientList'
import type { PatientDTO, PatientMinimalDTO } from '../../mutations/patient_mutations'
import {
  useAssignBedMutation,
  usePatientCreateMutation,
  usePatientDischargeMutation, useReadmitPatientMutation,
  useUnassignMutation
} from '../../mutations/patient_mutations'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DragCard } from '../../components/cards/DragCard'
import { Span } from '@helpwave/common/components/Span'
import type { BedWithPatientWithTasksNumberDTO } from '../../mutations/bed_mutations'
import { PatientCard } from '../../components/cards/PatientCard'
import { useWardQuery } from '../../mutations/ward_mutations'

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
  const router = useRouter()
  const [draggedPatient, setDraggedPatient] = useState<{
    patient?: PatientMinimalDTO,
    bed?: BedWithPatientWithTasksNumberDTO
  }>()
  const { id } = router.query
  const wardId = id as string
  const { data: ward } = useWardQuery(wardId)

  const organizationId = ward?.organizationId ?? ''
  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardId
  })
  const [draggingRoomId, setDraggingRoomId] = useState<string>()
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
  const readmitPatientMutation = useReadmitPatientMutation()

  const sensorOptions = { activationConstraint: { distance: 8 } }
  const sensors = useSensors(
    useSensor(MouseSensor, sensorOptions),
    useSensor(TouchSensor, sensorOptions)
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    if (active.data.current?.bed) {
      setDraggedPatient({
        bed: { ...(active.data.current.bed as BedWithPatientWithTasksNumberDTO) }
      })
    } else {
      setDraggedPatient({
        patient: { ...(active.data.current as PatientMinimalDTO) }
      })
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {
      active,
      over
    } = event
    const overData = over?.data.current
    const patientId = draggedPatient?.patient?.id ?? draggedPatient?.bed?.patient?.id ?? ''
    if (overData && active.data.current) {
      if (overData.patientListSection) {
        // Moving in patientlist
        if (overData.patientListSection === 'unassigned') {
          console.log(active.data.current)
          if (active.data.current.discharged) {
            readmitPatientMutation.mutate(patientId)
          } else {
            unassignMutation.mutate(patientId)
          }
          unassignMutation.mutate(patientId)
        } else if (overData.patientListSection === 'discharged') {
          dischargeMutation.mutate(patientId)
        }
      } else {
        // Moving on bed cards
        setDraggingRoomId(overData.room.id)
        assignBedMutation.mutate({
          id: overData.bed.id,
          patientId
        })
      }
    }

    setDraggedPatient(undefined)
  }, [assignBedMutation, unassignMutation, dischargeMutation, draggedPatient])

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
          display: translation.organization,
          link: ward ? `/organizations?organizationId=${ward.organizationId}` : '/organizations'
        },
        {
          display: translation.ward,
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
        title={translation.addPatientDialogTitle}
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
            left={() => (<WardRoomList key={wardId}/>)}
            right={width =>
              isShowingPatientList ? (
                  <PatientList width={width}/>
              ) :
                contextState.patientId && (
                  <div>
                    <PatientDetail
                      key={contextState.patient?.id}
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
