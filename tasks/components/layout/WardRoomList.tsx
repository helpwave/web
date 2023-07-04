import { tw } from '@helpwave/common/twind'
import { RoomOverview } from '../RoomOverview'
import type { RoomOverviewDTO } from '../../mutations/room_mutations'
import type { BedWithPatientWithTasksNumberDTO } from '../../mutations/bed_mutations'
import { useContext } from 'react'
import { WardOverviewContext } from '../../pages/ward/[uuid]'
import { useRoomOverviewsQuery } from '../../mutations/room_mutations'

export type WardRoomListProps = {
  selectedBed?: BedWithPatientWithTasksNumberDTO,
  rooms?: RoomOverviewDTO[]
}

/**
 * The left side component of the page showing all Rooms of a Ward
 */
export const WardRoomList = ({
  rooms
}: WardRoomListProps) => {
  const context = useContext(WardOverviewContext)
  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardID)

  if (isError) {
    return <div>Error in WardRoomList!</div>
  }

  if (isLoading) {
    return <div>Loading WardRoomList!</div>
  }

  rooms ??= data

  return (
    <div className={tw('flex flex-col px-6 py-8')}>
      {rooms.map(room => (
          <RoomOverview
            key={room.id}
            room={room}
          />
      )
      )}
    </div>
  )
}
