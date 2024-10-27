import { useContext } from 'react'
import { tw } from '@helpwave/common/twind'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import Link from 'next/link'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import { useRoomOverviewsQuery } from '@helpwave/api-services/mutations/tasks/room_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { RoomOverview } from '../RoomOverview'
import { WardOverviewContext } from '@/pages/ward/[wardId]'

type WardRoomListTranslation = {
  roomOverview: string,
  showPatientList: string,
  editWard: string,
  noRooms: string
}

const defaultWardRoomListTranslation: Record<Languages, WardRoomListTranslation> = {
  en: {
    roomOverview: 'Ward Overview',
    showPatientList: 'Show Patient List',
    editWard: 'Edit Ward',
    noRooms: 'This Ward has no rooms with beds.'
  },
  de: {
    roomOverview: 'Stationsübersicht',
    showPatientList: 'Patientenliste',
    editWard: 'Station bearbeiten',
    noRooms: 'Diese Station hat keine Räume mit Betten.'
  }
}

export type WardRoomListProps = {
  selectedBed?: BedWithPatientWithTasksNumberDTO,
  rooms?: RoomOverviewDTO[]
}

/**
 * The left side component of the page showing all Rooms of a Ward
 */
export const WardRoomList = ({
  overwriteTranslation,
  rooms
}: PropsForTranslation<WardRoomListTranslation, WardRoomListProps>) => {
  const translation = useTranslation(defaultWardRoomListTranslation, overwriteTranslation)
  const {
    state: contextState,
    updateContext
  } = useContext(WardOverviewContext)
  const {
    data,
    isError,
    isLoading
  } = useRoomOverviewsQuery(contextState.wardId)
  const { organization } = useAuth()

  const displayableRooms = (rooms ?? data ?? []).filter(room => room.beds.length > 0)

  return (
    <div className={tw('flex flex-col px-6 py-4')}
         onClick={() => updateContext({ wardId: contextState.wardId })}
    >
      <div className={tw('flex flex-row justify-between items-center pb-4')}>
        <Span type="title">{translation.roomOverview}</Span>
        <Button onClick={event => {
          event.stopPropagation()
          updateContext({ wardId: contextState.wardId })
        }}>
          {translation.showPatientList}
        </Button>
      </div>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {displayableRooms.length > 0 ?
          displayableRooms.map(room => (
            <RoomOverview
              key={room.id}
              room={room}
            />
          )) : (
            <div className={tw('flex flex-col gap-y-2 items-center')}>
              <Span>{translation.noRooms}</Span>
              <Link href={`/organizations/${organization?.id ?? ''}?wardId=${contextState.wardId}`}>
                <Button>{translation.editWard}</Button>
              </Link>
            </div>
          )}
      </LoadingAndErrorComponent>
    </div>
  )
}
