import { createContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import type { RoomOverviewDTO } from '../../mutations/room_mutations'
import { PatientDetail } from '../../components/layout/PatientDetails'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { WardRoomList } from '../../components/layout/WardRoomList'
import { PatientList } from '../../components/layout/PatientList'
import type {
  BedMinimalDTO
} from '../../mutations/bed_mutations'
import type { PatientDTO } from '../../mutations/patient_mutations'
import {
  useAssignBedMutation,
  usePatientCreateMutation
} from '../../mutations/patient_mutations'

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
   patient === undefined means no patient

   patient?.id === "" means creating a new patient
   */
  patient?: PatientDTO,
  bed?: BedMinimalDTO,
  room?: RoomOverviewDTO,
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
  const { user } = useAuth()
  const { uuid } = router.query
  const wardUUID = uuid as string

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardID: wardUUID
  })

  const isShowingPatientDialog = contextState.patient?.id === ''
  const isShowingPatientList = contextState.patient === undefined || isShowingPatientDialog

  const organizationUUID = 'org1' // TODO get this information somewhere
  useEffect(() => {
    setContextState({ wardID: wardUUID })
  }, [wardUUID])

  const assignBedMutation = useAssignBedMutation(bed => {
    const updatedContext = contextState
    updatedContext.bed = bed

    setContextState(updatedContext)
  })

  const createMutation = usePatientCreateMutation(patient => {
    const updatedContext = contextState
    updatedContext.patient = patient
    console.log(patient)
    if (contextState.bed) {
      assignBedMutation.mutate({ ...contextState.bed, patient })
    }
    setContextState(updatedContext)
  })

  console.log(contextState)
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
            setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID })
          }
        }}
        onCancel={() => {
          setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID })
        }}
        onBackgroundClick={() => {
          setContextState({ ...emptyWardOverviewContextState, wardID: contextState.wardID })
        }}
      />
      <WardOverviewContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          constraints={{ right: { min: '580px' }, left: { min: '33%' } }}
          baseLayoutValue="-580px"
          left={() => (<WardRoomList key={wardUUID}/>)}
          right={width =>
            isShowingPatientList ? (
                  <PatientList
                    width={width}
                    wardUUID={wardUUID}
                  />
            ) :
              contextState.bed && contextState.room && contextState.patient && (
                <div>
                  <PatientDetail
                    key={contextState.patient?.id}
                    width={width}
                    bedPosition={contextState.bed.index}
                    bedsInRoom={contextState.room.beds.length}
                  />
                </div>
              )
          }
        />
      </WardOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardOverview
