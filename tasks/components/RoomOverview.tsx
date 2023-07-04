import { tw } from '@helpwave/common/twind'
import { PatientCard } from './cards/PatientCard'
import { BedCard } from './cards/BedCard'
import type { RoomOverviewDTO } from '../mutations/room_mutations'
import { noop } from '@helpwave/common/components/user_input/Input'
import { Span } from '@helpwave/common/components/Span'
import type { BedWithPatientWithTasksNumberDTO } from '../mutations/bed_mutations'

export type RoomOverviewProps = {
  room: RoomOverviewDTO,
  selected: BedWithPatientWithTasksNumberDTO | undefined,
  onSelect: (bed: BedWithPatientWithTasksNumberDTO) => void,
  onAddPatient?: (bed: BedWithPatientWithTasksNumberDTO) => void
}

/**
 * A component to show all beds and patients within a room in a ward
 */
export const RoomOverview = ({ room, onSelect, selected, onAddPatient = noop }: RoomOverviewProps) => {
  return (
    <div>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <Span type="subsectionTitle">{room.name}</Span>
      </div>
      <div className={tw('grid grid-cols-3 gap-4')}>
        {room.beds.map(bed => bed.patient !== undefined ?
            (
            <PatientCard
              key={bed.id}
              bedName={bed.name}
              patientName={bed.patient.name}
              doneTasks={bed.patient.tasksDone}
              inProgressTasks={bed.patient.tasksInProgress}
              unscheduledTasks={bed.patient.tasksUnscheduled}
              onTileClick={() => onSelect(bed)}
              isSelected={selected?.id === bed.id}
            />
            ) : (
            <BedCard
              key={bed.name}
              bed={bed}
              onTileClick={() => onAddPatient(bed)}
              isSelected={selected?.id === bed.id}/>
            )
        )}
      </div>
    </div>
  )
}
