import { createContext, useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../../hooks/useAuth'
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
  usePatientCreateMutation, usePatientDischargeMutation, useUnassignMutation
} from '../../mutations/patient_mutations'
import type {
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { DragCard } from '../../components/cards/DragCard'
import { Span } from '@helpwave/common/components/Span'

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
    roomOverview: 'Room Overview',
    organization: 'Organization',
    ward: 'Ward',
    room: 'Room',
    addPatientDialogTitle: 'Do you want to add a new patient?'
  },
  de: {
    beds: 'Bett',
    roomOverview: 'Raum Übersicht',
    organization: 'Organisation',
    ward: 'Station',
    room: 'Raum',
    addPatientDialogTitle: 'Willst du einen neuen Patienten hinzufügen?'
  }
}

export type WardOverviewContextState = {
  /**
   patient set means creating patient
   patientID is the current patient
   */
  patient?: PatientDTO,
  patientID?: string,
  bedID?: string,
  roomID?: string,
  wardID: string
}

const emptyWardOverviewContextState = {
  wardID: ''
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
  const [draggedPatient, setDraggedPatient] = useState<PatientMinimalDTO>()
  const { user } = useAuth()
  const { uuid } = router.query
  const wardUUID = uuid as string

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardID: wardUUID
  })
  const [draggingRoomID, setDraggingRoomID] = useState<string>()
  const assignBedMutation = useAssignBedMutation(bed => {
    if (draggingRoomID) {
      setContextState({
        ...contextState,
        bedID: bed.id,
        patientID: bed.patientID,
        roomID: draggingRoomID,
        patient: undefined
      })
    } else {
      setContextState({
        ...contextState,
        bedID: bed.id,
        patientID: bed.patientID,
        patient: undefined
      })
    }

    setDraggingRoomID(undefined)
  })
  const unassignMutation = useUnassignMutation()
  const dischargeMutation = usePatientDischargeMutation()

  const createMutation = usePatientCreateMutation(patient => {
    if (contextState.bedID) {
      assignBedMutation.mutate({ id: contextState.bedID, patientID: patient.id })
    }
    setContextState({ ...contextState, patient: undefined })
  })

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setDraggedPatient({
      ...(active.data.current as PatientMinimalDTO)
    })
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    const overData = over?.data.current
    if (overData && active.data.current) {
      if (overData.patientListSection) {
        // Moving in patientlist
        if (overData.patientListSection === 'unassigned') {
          unassignMutation.mutate(active.data.current.id) // TODO this doesn't work for unassigned patients
        } else if (overData.patientListSection === 'discharged') {
          dischargeMutation.mutate(active.data.current.id)
        }
      } else {
        // Moving on bed cards
        setDraggingRoomID(overData.room.id)
        assignBedMutation.mutate({ id: overData.bed.id, patientID: active.data.current.id })
      }
    }

    setDraggedPatient(undefined)
  }, [assignBedMutation, unassignMutation, dischargeMutation])

  const handleDragCancel = useCallback(() => {
    setDraggedPatient(undefined)
  }, [])

  const isShowingPatientDialog = !!contextState.patient
  const isShowingPatientList = contextState.patientID === undefined || isShowingPatientDialog

  const organizationUUID = 'org1' // TODO get this information somewhere
  useEffect(() => {
    setContextState({ wardID: wardUUID })
  }, [wardUUID])

  if (!user) return null

  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organization, link: `/organizations?organizationID=${organizationUUID}` },
        { display: translation.ward, link: `/organizations/${organizationUUID}?wardID=${wardUUID}` },
        { display: translation.room, link: `/ward/${wardUUID}` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.roomOverview)}</title>
      </Head>
      <ConfirmDialog
        isOpen={isShowingPatientDialog}
        title={translation.addPatientDialogTitle}
        onConfirm={() => {
          if (contextState.patient) {
            createMutation.mutate(contextState.patient)
          } else {
            setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID, patient: undefined })
          }
        }}
        onCancel={() => {
          setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID, patient: undefined })
        }}
        onBackgroundClick={() => {
          setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID, patient: undefined })
        }}
      />
      <WardOverviewContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <TwoColumn
            disableResize={false}
            constraints={{ right: { min: '580px' }, left: { min: '33%' } }}
            baseLayoutValue="-580px"
            left={() => (<WardRoomList key={wardUUID}/>)}
            right={width =>
              isShowingPatientList ? (
                    <PatientList width={width}/>
              ) :
                contextState.bedID && contextState.roomID && contextState.patientID && (
                  <div>
                    <PatientDetail
                      key={contextState.patient?.id}
                      width={width}
                    />
                  </div>
                )
            }
          />
          <DragOverlay style={{ width: '200px' }}>
            {draggedPatient ? <DragCard cardDragProperties={{ isDragging: true }}><Span>{draggedPatient.name}</Span></DragCard> : null}
          </DragOverlay>
        </DndContext>
      </WardOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardOverview
