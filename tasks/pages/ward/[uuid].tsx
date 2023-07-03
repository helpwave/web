import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import type { BedDTO, RoomDTO } from '../../mutations/room_mutations'
import {
  useRoomQuery,
  useDischargeMutation,
  useUpdateMutation
} from '../../mutations/room_mutations'
import { PatientDetail } from '../../components/layout/PatientDetails'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { WardRoomList } from '../../components/layout/WardRoomList'
import { PatientList } from '../../components/layout/PatientList'

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

const emptyBed: BedDTO = {
  id: '',
  name: '',
  patient: { id: '', humanReadableIdentifier: '', note: '', tasks: [] },
}

const WardOverview: NextPage = ({ language }: PropsWithLanguage<WardOverviewTranslation>) => {
  const translation = useTranslation(language, defaultWardOverviewTranslation)
  const [selectedBed, setSelectedBed] = useState<BedDTO>(emptyBed)
  const [isShowingPatientDialog, setIsShowingPatientDialog] = useState<boolean>(false)

  const router = useRouter()
  const { user } = useAuth()
  const { uuid } = router.query
  const wardUUID = uuid as string
  const organizationUUID = 'org1' // TODO get this information somewhere

  const { isLoading, isError, data } = useRoomQuery()

  const rooms = data as RoomDTO[]
  let roomOfSelected: RoomDTO | undefined
  let numberOfBeds = 0
  let bedPosition = 0
  if (rooms) {
    for (const room of rooms) {
      bedPosition = room.beds.findIndex(value => value.id === selectedBed?.id)
      if (bedPosition !== -1) {
        roomOfSelected = room
        numberOfBeds = room.beds.length
        break
      }
    }
  }

  // TODO add create later on
  // const createMutation = useCreateMutation(setSelectedBed, wardUUID, roomOfSelected?.id ?? '')
  const updateMutation = useUpdateMutation(setSelectedBed, wardUUID, roomOfSelected?.id ?? '')
  const dischargeMutation = useDischargeMutation(setSelectedBed, wardUUID, roomOfSelected?.id ?? '')

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
          updateMutation.mutate(selectedBed)
          setIsShowingPatientDialog(false)
        }}
        onCancel={() => {
          setIsShowingPatientDialog(false)
          setSelectedBed(emptyBed)
        }}
        onBackgroundClick={() => {
          setIsShowingPatientDialog(false)
          setSelectedBed(emptyBed)
        }}
      />
      <TwoColumn
        disableResize={false}
        constraints={{ right: { min: '580px' }, left: { min: '33%' } }}
        baseLayoutValue="-580px"
        left={() => (
          <WardRoomList
            rooms={rooms}
            setSelectedBed={setSelectedBed}
            selectedBed={selectedBed}
            setIsShowingPatientDialog={setIsShowingPatientDialog}
          />
        )}
        right={width =>
          selectedBed.id === '' || selectedBed.patient === undefined || isShowingPatientDialog ?
            <PatientList width={width}/> :
              (
              <div>
                <PatientDetail
                  width={width}
                  key={selectedBed.id}
                  bedPosition={bedPosition}
                  bedsInRoom={numberOfBeds}
                  patient={selectedBed.patient}
                  onUpdate={patient => updateMutation.mutate({ ...selectedBed, patient })}
                  onDischarge={patient => dischargeMutation.mutate({ ...selectedBed, patient })}
                />
              </div>
              )
        }
      />
    </PageWithHeader>
  )
}

export default WardOverview
