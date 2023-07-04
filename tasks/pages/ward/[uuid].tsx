import {createContext, , useState} from 'react'
import type {NextPage} from 'next'
import Head from 'next/head'
import {useAuth} from '../../hooks/useAuth'
import {useRouter} from 'next/router'
import type {PropsWithLanguage} from '@helpwave/common/hooks/useTranslation'
import {useTranslation} from '@helpwave/common/hooks/useTranslation'
import {TwoColumn} from '../../components/layout/TwoColumn'
import type {RoomMinimalDTO, RoomOverviewDTO} from '../../mutations/room_mutations'
import {
  useDischargeMutation,
  useUpdateMutation, useRoomOverviewsQuery
} from '../../mutations/room_mutations'
import {PatientDetail} from '../../components/layout/PatientDetails'
import {PageWithHeader} from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'
import {ConfirmDialog} from '@helpwave/common/components/modals/ConfirmDialog'
import {WardRoomList} from '../../components/layout/WardRoomList'
import type {
  BedDTO, BedMinimalDTO,
  BedWithPatientWithTasksNumberDTO
} from '../../mutations/bed_mutations'
import {
  emptyBed,
  emptyBedWithPatientWithTasksNumber
} from '../../mutations/bed_mutations'
import type {PatientDTO} from '../../mutations/patient_mutations'
import {emptyPatient, useCreateMutation} from "../../mutations/patient_mutations";

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
  patient?: PatientDTO,
  bed?: BedMinimalDTO,
  room?: RoomMinimalDTO
  wardID: string,
}

const emptyWardOverviewContextState = {
  wardID: ""
}

export type WardOverviewContextType = {
  state: WardOverviewContextState
  updateContext: (context: WardOverviewContextState) => void
}

export const WardOverviewContext = createContext<WardOverviewContextType>({
  state: emptyWardOverviewContextState,
  updateContext: () => {
  }
})

const WardOverview: NextPage = ({language}: PropsWithLanguage<WardOverviewTranslation>) => {
  const translation = useTranslation(language, defaultWardOverviewTranslation)
  const router = useRouter()
  const {user} = useAuth()
  const {uuid} = router.query
  const wardUUID = uuid as string

  const [contextState, setContextState] = useState<WardOverviewContextState>({
    wardID: wardUUID
  })

  const isShowingPatientDialog = !!contextState.patient?.id


  const organizationUUID = 'org1' // TODO get this information somewhere

  const {isLoading, isError, data} = useRoomOverviewsQuery(wardUUID)

  const rooms = data

  const createMutation = useCreateMutation(patient => {
    const updatedContext = contextState;
    updatedContext.patient = {...emptyPatient, id: patient.id}
    setContextState(updatedContext)
  });

  if (!user) return null

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <PageWithHeader
      crumbs={[
        {display: translation.organization, link: `/organizations?organizationID=${organizationUUID}`},
        {display: translation.ward, link: `/organizations/${organizationUUID}?wardID=${wardUUID}`},
        {display: translation.room, link: `/ward/${wardUUID}`}
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.roomOverview)}</title>
      </Head>
      <ConfirmDialog
        isOpen={isShowingPatientDialog}
        title={translation.addPatientDialogTitle}
        onConfirm={() => {
          createMutation.mutate(contextState.patient!)
        }}
        onCancel={() => {
          setContextState({...emptyWardOverviewContextState, wardID: contextState.wardID})
        }}
        onBackgroundClick={() => {
          setContextState({...emptyWardOverviewContextState, wardID: contextState.wardID})
        }}
      />
      <WardOverviewContext.Provider value={{state: contextState, updateContext: setContextState}}>
        <TwoColumn
          disableResize={false}
          constraints={{right: {min: '580px'}, left: {min: '33%'}}}
          baseLayoutValue="-580px"
          left={() => rooms && (
            <WardRoomList
              rooms={rooms}
              setSelectedBed={setSelectedBed}
              selectedBed={selectedBed}
              setIsShowingPatientDialog={setIsShowingPatientDialog}
            />
          )}
          right={width =>
            selectedBed.id === '' || selectedBed.patient === undefined || isShowingPatientDialog ?
              <div>No Room or Patient Selected</div> :
              (
                <div>
                  <PatientDetail
                    width={width}
                    key={selectedBed.id}
                    bedPosition={bedPosition}
                    bedsInRoom={numberOfBeds}
                    patient={selectedBed.patient}
                    onUpdate={patient => updateMutation.mutate({...selectedBed, patient})}
                    onDischarge={patient => dischargeMutation.mutate({...selectedBed, patient})}
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
