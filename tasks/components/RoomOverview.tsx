import { tw } from '@helpwave/common/twind/index'
import { PatientCard } from './PatientCard'
import { BedCard } from './BedCard'

type PatientDTO = {
  name: string,
  unscheduled: number,
  inProgress: number,
  done: number
}

type BedDTO = {
  name: string,
  patient?: PatientDTO
}

type RoomDTO = {
  name: string,
  beds: BedDTO[]
}

export type RoomOverviewProps = {
  room: RoomDTO
}

export const RoomOverview = ({ room }: RoomOverviewProps) => {
  return (
    <div>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <span className={tw('font-bold')}>{room.name}</span>
      </div>
      <div className={tw('grid grid-cols-3 gap-4')}>
        {room.beds.map(bed => bed.patient !== undefined ?
            (
              <PatientCard key={bed.name} patient={bed.patient} bed={bed} onTileClick={() => {
                // TODO open bed/patient screen
              }}/>
            ) : (<BedCard key={bed.name} bed={bed}/>)
        )}
      </div>
    </div>
  )
}
