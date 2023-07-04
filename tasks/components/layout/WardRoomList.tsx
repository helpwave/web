import { tw } from '@helpwave/common/twind'
import { RoomOverview } from '../RoomOverview'
import type { RoomOverviewDTO } from '../../mutations/room_mutations'
import type { BedWithPatientWithTasksNumberDTO } from '../../mutations/bed_mutations'

export type WardRoomListProps = {
  selectedBed: BedWithPatientWithTasksNumberDTO,
  setSelectedBed: (bed: BedWithPatientWithTasksNumberDTO) => void,
  setIsShowingPatientDialog: (isShowing: boolean) => void,
  rooms: RoomOverviewDTO[]
}

/**
 * The left side component of the page showing all Rooms of a Ward
 */
export const WardRoomList = ({
  selectedBed,
  setSelectedBed,
  setIsShowingPatientDialog,
  rooms
}: WardRoomListProps) => {
  return (
    <div className={tw('flex flex-col px-6 py-8')}>
      {rooms.map(room => (
          <RoomOverview
            key={room.id}
            room={room}
            onSelect={setSelectedBed}
            selected={selectedBed}
            onAddPatient={bed => {
              setSelectedBed({
                ...bed,
                patient: {
                  id: '',
                  name: '',
                  tasksInProgress: 0,
                  tasksDone: 0,
                  tasksUnscheduled: 0,
                }
              })
              setIsShowingPatientDialog(true)
            }}
          />
      )
      )}
    </div>
  )
}
