import { tw } from '@helpwave/common/twind'
import { RoomOverview } from '../RoomOverview'
import type { BedDTO, RoomDTO } from '../../mutations/room_mutations'

export type WardRoomListProps = {
  selectedBed: BedDTO,
  setSelectedBed: (bed: BedDTO) => void,
  setIsShowingPatientDialog: (isShowing: boolean) => void,
  rooms: RoomDTO[]
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
                  id: Math.random().toString(),
                  note: '',
                  humanReadableIdentifier: 'Patient ' + (room.beds.findIndex(value => value.id === bed?.id) + 1),
                  tasks: []
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
