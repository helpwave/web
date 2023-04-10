import { tw } from '@helpwave/common/twind/index'
import { PatientCard } from './cards/PatientCard'
import { BedCard } from './cards/BedCard'
import type { BedDTO, RoomDTO } from '../mutations/room_mutations'

export type RoomOverviewProps = {
  room: RoomDTO,
  selected: BedDTO|undefined,
  onSelect: (bed: BedDTO) => void
}

export const RoomOverview = ({ room, onSelect, selected }: RoomOverviewProps) => {
  return (
    <div>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <span className={tw('font-bold')}>{room.name}</span>
      </div>
      <div className={tw('grid grid-cols-3 gap-4')}>
        {room.beds.map(bed => bed.patient !== undefined ?
            (
              <PatientCard key={bed.name} patient={bed.patient} bed={bed} onTileClick={() => onSelect(bed)} isSelected={selected?.id === bed.id} />
            ) : (<BedCard key={bed.name} bed={bed} onTileClick={() => onSelect(bed)} isSelected={selected?.id === bed.id} />)
        )}
      </div>
    </div>
  )
}
