import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
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
import { RoomOverview } from '../../components/RoomOverview'
import { PatientDetail } from '../../components/layout/PatientDetails'

type WardOverviewTranslation = {
  beds: string,
  roomOverview: string
}

const defaultWardOverviewTranslation = {
  en: {
    beds: 'Betten',
    roomOverview: 'Room Overview'
  },
  de: {
    beds: 'Bett',
    roomOverview: 'Raum Übersicht'
  }
}

const WardOverview: NextPage = ({ language }: PropsWithLanguage<WardOverviewTranslation>) => {
  const translation = useTranslation(language, defaultWardOverviewTranslation)
  const [selectedBed, setSelectedBed] = useState<BedDTO | undefined>(undefined)

  const router = useRouter()
  const { user } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))
  const { uuid } = router.query
  const wardUUID = uuid as string

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
    <div className={tw('w-screen h-screen flex flex-col')}>
      <Head>
        <title>{translation.roomOverview}</title>
      </Head>
      <TwoColumn
        left={(
          <div className={tw('flex flex-col px-6 py-8')}>
            {rooms.map(room => (
              <RoomOverview
                key={room.id}
                room={room}
                onSelect={setSelectedBed}
                selected={selectedBed}
                onUpdate={bed => updateMutation.mutate({ ...bed }) }
              />
            )
            )}
          </div>
        )}
        right={
          selectedBed === undefined || selectedBed.patient === undefined ?
              (<div>No Room or Patient Selected</div>) :
              (
              <div>
                <PatientDetail
                  key={selectedBed.id}
                  bedPosition={bedPosition}
                  bedsInRoom={numberOfBeds}
                  patient={selectedBed.patient}
                  onUpdate={patient => updateMutation.mutate({ ...selectedBed, patient })}
                  onDischarge={patient => dischargeMutation.mutate({ ...selectedBed, patient })}
                />
              </div>
              )
        }/>
    </div>
  )
}

export default WardOverview
