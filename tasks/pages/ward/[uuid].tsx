import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { tw } from '@helpwave/common/twind/index'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { Header } from '../../components/Header'
import { UserMenu } from '../../components/UserMenu'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import {
  useRoomQuery,
  useCreateMutation,
  useDeleteMutation,
  useUpdateMutation
} from '../../mutations/room_mutations'
import { RoomOverview } from '../../components/RoomOverview'
import {PatientDetail} from "../../components/layout/PatientDetails";

type BedsPageTranslation = {
  beds: string,
  roomOverview: string
}

const defaultBedsPageTranslation = {
  en: {
    beds: 'Betten',
    roomOverview: 'Room Overview'
  },
  de: {
    beds: 'Bett',
    roomOverview: 'Raum Übersicht'
  }
}

type TaskDTO = {
  id: string,
  name: string,
  description: string,
  status: 'unscheduled' | 'inProgress' | 'done',
  progress: number
}

type PatientDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
}

type BedDTO = {
  id: string,
  name: string,
  patient?: PatientDTO
}

type RoomDTO = {
  id: string,
  name: string,
  beds: BedDTO[]
}

type SelectType = {
  room?: RoomDTO,
  bed?: BedDTO
}

const BedsPage: NextPage = ({ language }: PropsWithLanguage<BedsPageTranslation>) => {
  const translation = useTranslation(language, defaultBedsPageTranslation)
  const [selectedBed, setSelectedBed] = useState<SelectType>({})

  const router = useRouter()
  const { user, logout, accessToken } = useAuth(() => router.push({ pathname: '/login', query: { back: true } }))
  const { uuid } = router.query
  const wardUUID = uuid as string

  const createMutation = useCreateMutation(setSelectedBed, wardUUID)
  const updateMutation = useUpdateMutation(setSelectedBed, wardUUID)
  const deleteMutation = useDeleteMutation(setSelectedBed, wardUUID)
  const { isLoading, isError, data, error } = useRoomQuery()

  const rooms = data as RoomDTO[]
  let roomOfSelected = undefined
  for(let room of rooms){
    if(room.beds.findIndex(value => value.id === selectedBed?.id)){
      roomOfSelected = room;
      break;
    }
  }

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

      <Header
        title="helpwave"
        navigation={[
          { text: 'Dashboard', href: '/' },
          { text: 'Contact', href: '/contact' },
        ]}
        actions={[<UserMenu key="user-menu" user={user}/>]}
      />
      <TwoColumn
        left={(
          <div className={tw('flex flex-col')}>
            {rooms.map(room => (<RoomOverview key={room.id} room={room}/>))}
          </div>
        )}
        right={(
          <PatientDetail bedPosition={} bedsInRoom={} patient={} onUpdate={}>
        )}
      />
    </div>
  )
}

export default BedsPage
