import { useContext } from 'react'
import { tw } from '@helpwave/common/twind'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import { RoomOverview } from '../RoomOverview'
import { useRoomOverviewsQuery, type RoomOverviewDTO } from '@/mutations/room_mutations'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import type { BedWithPatientWithTasksNumberDTO } from '@/mutations/bed_mutations'

type WardRoomListTranslation = {
  roomOverview: string,
  showPatientList: string
}

const defaultWardRoomListTranslation: Record<Languages, WardRoomListTranslation> = {
  en: {
    roomOverview: 'Ward Overview',
    showPatientList: 'Show Patient List'
  },
  de: {
    roomOverview: 'Stationsübersicht',
    showPatientList: 'Patientenliste'
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
  const context = useContext(WardOverviewContext)
  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardId)

  rooms ??= data

  if (rooms) {
    rooms = rooms.sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div className={tw('flex flex-col px-6 py-4')}
      onClick={() => context.updateContext({ wardId: context.state.wardId })}
    >
      <div className={tw('flex flex-row justify-between items-center pb-4')}>
        <Span type="title">{translation.roomOverview}</Span>
        <Button onClick={event => {
          event.stopPropagation()
          context.updateContext({ wardId: context.state.wardId })
        }}>
          {translation.showPatientList}
        </Button>
      </div>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {rooms && rooms.filter(room => room.beds.length > 0).map(room => (
            <RoomOverview
              key={room.id}
              room={room}
            />
        )
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
