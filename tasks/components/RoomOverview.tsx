import { tw } from '@helpwave/common/twind/index'
import { PatientCard } from './cards/PatientCard'
import { BedCard } from './cards/BedCard'
import type { BedDTO, RoomDTO } from '../mutations/room_mutations'
import { noop } from './user_input/Input'

export type RoomOverviewProps = {
  room: RoomDTO,
  selected: BedDTO | undefined,
  onSelect: (bed: BedDTO) => void,
  onUpdate?: (bed: BedDTO) => void
}

export const RoomOverview = ({ room, onSelect, selected, onUpdate = noop }: RoomOverviewProps) => {
  return (
    <div>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <span className={tw('font-bold')}>{room.name}</span>
      </div>
      <div className={tw('grid grid-cols-3 gap-4')}>
        {room.beds.map(bed => bed.patient !== undefined ?
            (
            <PatientCard key={bed.name} patient={bed.patient} bed={bed} onTileClick={() => onSelect(bed)}
                         isSelected={selected?.id === bed.id}/>
            ) : (
            <BedCard
              key={bed.name}
              bed={bed}
              onTileClick={() => {
                // TODO update this later on with a create mutation for the patient
                onSelect(bed)
                onUpdate({
                  ...bed,
                  patient: {
                    id: Math.random().toString(),
                    note: '',
                    humanReadableIdentifier: 'Patient ' + (room.beds.findIndex(value => value.id === bed?.id) + 1),
                    tasks: []
                  }
                })
              }}
              isSelected={selected?.id === bed.id}/>
            )
        )}
      </div>
    </div>
  )
}
