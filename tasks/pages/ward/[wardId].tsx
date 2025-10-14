import { createContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useWardQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import {
  usePatientAssignToBedMutation,
  usePatientDischargeMutation,
  usePatientReadmitAndAssignMutation,
  usePatientReadmitMutation,
  usePatientUnassignMutation
} from '@helpwave/api-services/mutations/tasks/patient_mutations'
import type { WardOverviewDraggableData } from '@/components/dnd-kit-instances/patients'
import { WardOverviewDndContext } from '@/components/dnd-kit-instances/patients'
import { PatientDetail } from '@/components/layout/PatientDetails'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { PatientList } from '@/components/layout/PatientList'
import { DragCard } from '@/components/cards/DragCard'
import { PatientCard } from '@/components/cards/PatientCard'
import { useRouteParameters } from '@/hooks/useRouteParameters'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { WardRoomList } from '@/components/layout/WardRoomList'

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
  patientId?: string,
  bedId?: string,
  wardId: string,
}

const emptyWardOverviewContextState = {
  wardId: '',
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

  // Parsing URL and loading data for breadcrumbs
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const { wardId, patientId } = useRouteParameters<'wardId', 'patientId'>()
  const { data: ward } = useWardQuery(wardId)
  const { organization } = useAuth()

  const [contextState, setContextState] = useState<WardOverviewContextState>({ wardId, patientId })
  useEffect(() => {
    if (!usedQueryParam && !!patientId) {
      setContextState(prevState => ({ ...prevState, patientId, wardId }))
      setUsedQueryParam(true)
    }
  }, [patientId, wardId, usedQueryParam])

  // Mutations
  const assignBedMutation = usePatientAssignToBedMutation()
  const unassignMutation = usePatientUnassignMutation()
  const dischargeMutation = usePatientDischargeMutation()
  const readmitMutation = usePatientReadmitMutation()
  const readmitAndAssignMutation = usePatientReadmitAndAssignMutation()

  // Drag and Drop
  const [draggedElementData, setDraggedElementData] = useState<WardOverviewDraggableData>()
  const sensorOptions = { activationConstraint: { distance: 8 } }
  const sensors = useSensors(
    useSensor(MouseSensor, sensorOptions),
    useSensor(TouchSensor, sensorOptions)
  )

  const isShowingPatientList = !contextState.patientId

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
      <WardOverviewContext.Provider value={{
        state: contextState,
        updateContext: setContextState
      }}>
        <WardOverviewDndContext
          sensors={sensors}
          onDragStart={event => {
            setDraggedElementData(event.active.data.current)
          }}
          onDragCancel={() => {
            setDraggedElementData(undefined)
          }}
          onDragAbort={() => {
            setDraggedElementData(undefined)
          }}
          onDragEnd={({ active, over }) => {
            const draggedData = active.data.current
            const overData = over?.data.current
            if (!draggedData || !overData) {
              setDraggedElementData(undefined)
              return
            }
            const patientId = draggedData.patient.id
            const isDischarged = draggedData.type === 'patientListItem' && draggedData.discharged
            const isAssigned =  (draggedData.type === 'patientListItem' && draggedData.assigned) || (draggedData.type === 'assignedPatient')
            if (overData.type === 'section') {
              if (isDischarged && overData.section === 'unassigned') {
                readmitMutation.mutate(patientId)
              } else if(!isDischarged && overData.section === 'unassigned' && isAssigned) {
                unassignMutation.mutate(patientId)
              } else if (!isDischarged && overData.section === 'discharged') {
                dischargeMutation.mutate(patientId)
              }
              // other cases don't produce a change
            } else if (overData.type === 'bed') {
              if (isDischarged) {
                readmitAndAssignMutation.mutate({ patientId, bedId: overData.bed.id })
              } else {
                assignBedMutation.mutate({ patientId, bedId: overData.bed.id })
              }
            }
            setDraggedElementData(undefined)
          }}
        >
          <TwoColumn
            disableResize={false}
            constraints={{
              right: { min: '650px' },
              left: { min: '33%' }
            }}
            baseLayoutValue="-580px"
            left={() => (<WardRoomList key={wardId} wardId={wardId}/>)}
            right={width =>
              isShowingPatientList ? (
                  <PatientList width={width} wardId={wardId}/>
                ) :
                (
                  <PatientDetail
                    key={contextState.patientId}
                    wardId={wardId}
                    width={width}
                  />
                )
            }
          />
          {/* TODO Optimistic updates in the patient mutations affecting
          the roomoverview mutation are needed to enable dropanimations */}
          <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
            {draggedElementData && (draggedElementData.type === 'patientListItem' ? (
                <DragCard cardDragProperties={{ isDragging: true }}>
                  <span>{draggedElementData.patient.humanReadableIdentifier}</span>
                </DragCard>
              ) : (
                <PatientCard
                  bedName={draggedElementData.bed.name}
                  patientName={draggedElementData.patient.humanReadableIdentifier}
                  taskCounts={{
                    done: draggedElementData.patient.tasksDone,
                    inProgress: draggedElementData.patient.tasksInProgress,
                    todo: draggedElementData.patient.tasksTodo
                  }}
                />
              )
            )}
          </DragOverlay>
        </WardOverviewDndContext>
      </WardOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardOverview
