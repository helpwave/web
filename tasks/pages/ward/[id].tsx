import { createContext, useEffect, useState } from 'react'
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
  bedId?: string,
  roomId?: string,
  wardId: string
}

const emptyWardOverviewContextState = {
  wardId: ''
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
  const { id } = router.query
  const wardId = id as string

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardId
  })

  const isShowingPatientDialog = contextState.patient?.id === ''
  const isShowingPatientList = contextState.patient === undefined || isShowingPatientDialog

  const organizationId = 'org1' // TODO get this information somewhere
  useEffect(() => {
    setContextState({ wardId })
  }, [wardId])

  const assignBedMutation = useAssignBedMutation()

  const createMutation = usePatientCreateMutation(patient => {
    const updatedContext = contextState
    updatedContext.patient = patient

    if (contextState.bedId) {
      assignBedMutation.mutate({ id: contextState.bedId, patientId: patient.id })
    }
    setContextState(updatedContext)
  })

  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organization, link: `/organizations?organizationId=${organizationId}` },
        { display: translation.ward, link: `/organizations/${organizationId}?wardId=${wardId}` },
        { display: translation.room, link: `/ward/${wardId}` }
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
            setContextState({ ...emptyWardOverviewContextState, wardId: contextState.wardId })
          }
        }}
        onCancel={() => {
          setContextState({ ...emptyWardOverviewContextState, wardId: contextState.wardId })
        }}
        onBackgroundClick={() => {
          setContextState({ ...emptyWardOverviewContextState, wardId: contextState.wardId })
        }}
      />
      <WardOverviewContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          constraints={{ right: { min: '580px' }, left: { min: '33%' } }}
          baseLayoutValue="-580px"
          left={() => (<WardRoomList key={wardId}/>)}
          right={width =>
            isShowingPatientList ? (
                  <PatientList width={width}/>
            ) :
              contextState.bedId && contextState.roomId && contextState.patient && (
                <div>
                  <PatientDetail
                    key={contextState.patient?.id}
                    width={width}
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
