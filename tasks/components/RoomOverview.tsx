import { tw } from '@helpwave/common/twind'
import { PatientCard } from './cards/PatientCard'
import { BedCard } from './cards/BedCard'
import type { RoomOverviewDTO } from '../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'
import type { BedMinimalDTO } from '../mutations/bed_mutations'
import { useContext, useEffect, useRef, useState } from 'react'
import { WardOverviewContext } from '../pages/ward/[uuid]'
import type { PatientDTO } from '../mutations/patient_mutations'
import { emptyPatient } from '../mutations/patient_mutations'

export type RoomOverviewProps = {
  room: RoomOverviewDTO
}

/**
 * A component to show all beds and patients within a room in a ward
 */
export const RoomOverview = ({ room }: RoomOverviewProps) => {
  const context = useContext(WardOverviewContext)
  const ref = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)

  const setSelectedBed = (room: RoomOverviewDTO, bed: BedMinimalDTO, patient: PatientDTO|undefined) =>
    context.updateContext({
      ...context.state,
      roomID: room.id,
      bedID: bed.id,
      patient
    })

  useEffect(() => {
    if (ref.current?.offsetWidth) {
      setColumns(Math.min(Math.max(1, Math.floor(ref.current?.offsetWidth / 200)), 4))
    }
  }, [ref.current?.offsetWidth])

  const selectedBedID = context.state.bedID

  return (
    <div className={tw('flex flex-col w-full')} ref={ref}>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <Span type="subsectionTitle">{room.name}</Span>
      </div>
      <div className={tw(`grid grid-cols-${columns} gap-4`)}>
        {room.beds.map(bed => bed.patient && bed.patient?.id ?
            (
            <PatientCard
              key={bed.id}
              bedName={bed.name}
              patientName={bed.patient.name}
              doneTasks={bed.patient.tasksDone}
              inProgressTasks={bed.patient.tasksInProgress}
              unscheduledTasks={bed.patient.tasksUnscheduled}
              onTileClick={(event) => {
                event.stopPropagation()
                if (bed.patient) {
                  // LINTER: `bed.patient.id` gets evaluated as undefined without this if
                  setSelectedBed(room, bed, {
                    ...emptyPatient,
                    id: bed.patient.id
                  })
                }
              }}
              isSelected={selectedBedID === bed.id}
            />
            ) : (
            <BedCard
              key={bed.id}
              bedName={bed.name}
              // TODO move patient creation to here
              onTileClick={(event) => {
                event.stopPropagation()
                setSelectedBed(room, bed, {
                  ...emptyPatient,
                  id: bed.patient?.id ?? '',
                  name: `Patient ${room?.beds.findIndex(bedOfRoom => bedOfRoom.id === bed.id) ?? 1}`
                })
              }}
              isSelected={selectedBedID === bed.id}/>
            )
        )}
      </div>
    </div>
  )
}
