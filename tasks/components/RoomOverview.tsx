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
import { Droppable } from './dnd-kit/Droppable'
import { Draggable } from './dnd-kit/Draggable'
import { DragCard } from './cards/DragCard'

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

  const setSelectedBed = (room: RoomOverviewDTO, bed: BedMinimalDTO, patientID?: string, patient?: PatientDTO) =>
    context.updateContext({
      ...context.state,
      roomID: room.id,
      bedID: bed.id,
      patientID,
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
              <Droppable id={bed.id} key={bed.id} data={{ bed, room }}>
                {({ isOver }) => bed.patient && bed.patient?.id && (
                  <DragCard
                    className={tw('!p-0 !border-0')}
                  >
                    <Draggable id={bed.patient.id + 'roomOverview'} data={{ bed }}>
                      {() => bed.patient && bed.patient?.id && (
                        <PatientCard
                          bedName={bed.name}
                          patientName={bed.patient.name}
                          doneTasks={bed.patient.tasksDone}
                          inProgressTasks={bed.patient.tasksInProgress}
                          unscheduledTasks={bed.patient.tasksUnscheduled}
                          onTileClick={(event) => {
                            event.stopPropagation()
                            if (bed.patient) {
                              // LINTER: `bed.patient.id` gets evaluated as undefined without this if
                              setSelectedBed(room, bed, bed.patient.id)
                            }
                          }}
                          isSelected={selectedBedID === bed.id}
                          cardDragProperties={{ isOver, isDangerous: true }}
                        />
                      )}
                    </Draggable>
                  </DragCard>
                )}
              </Droppable>
            ) : (
              // Maybe also wrap inside the drag and drop later
              <Droppable key={bed.id} id={bed.id} data={{ bed, room }}>
                {({ isOver, active }) => (!isOver ? (
                  <BedCard
                    bedName={bed.name}
                    // TODO move patient creation to here
                    onTileClick={(event) => {
                      event.stopPropagation()
                      setSelectedBed(room, bed, undefined, {
                        ...emptyPatient,
                        id: '',
                        name: `Patient ${room?.beds.findIndex(bedOfRoom => bedOfRoom.id === bed.id) ?? 1}`
                      })
                    }}
                    isSelected={selectedBedID === bed.id}
                  />
                ) : (
                  <PatientCard
                    bedName={bed.name}
                    patientName={active?.data.current?.bed?.patient?.name ?? active?.data.current?.name}
                    cardDragProperties={{ isOver }}
                  />
                )
                )}
              </Droppable>
            )
        )}
      </div>
    </div>
  )
}
