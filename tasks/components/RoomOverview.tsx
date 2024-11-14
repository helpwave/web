import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useEffect, useRef, useState } from 'react'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import type { BedMinimalDTO } from '@helpwave/api-services/types/tasks/bed'
import type { PatientDTO } from '@helpwave/api-services/types/tasks/patient'
import { emptyPatient } from '@helpwave/api-services/types/tasks/patient'
import { BedCard } from './cards/BedCard'
import { PatientCard } from './cards/PatientCard'
import { Droppable, Draggable } from './dnd-kit-instances/patients'
import { DragCard } from './cards/DragCard'
import { WardOverviewContext } from '@/pages/ward/[wardId]'

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

  const setSelectedBed = (room: RoomOverviewDTO, bed: BedMinimalDTO, patientId?: string, patient?: PatientDTO) =>
    context.updateContext({
      ...context.state,
      roomId: room.id,
      bedId: bed.id,
      patientId,
      patient
    })

  useEffect(() => {
    if (ref.current?.offsetWidth) {
      setColumns(Math.min(Math.max(1, Math.floor(ref.current?.offsetWidth / 200)), 4))
    }
  }, [ref.current?.offsetWidth])

  const selectedBedId = context.state.bedId

  return (
    <div className={tw('flex flex-col w-full')} ref={ref}>
      <div className={tw('flex flex-row items-center mb-1')}>
        <div className={tw('w-2 h-2 mx-2 rounded-full bg-gray-300')}/>
        <Span type="subsectionTitle">{room.name}</Span>
      </div>
      <div className={tw(`grid grid-cols-${columns} gap-4`)}>
        {room.beds.map((bed) => bed.patient && bed.patient?.id ?
            (
              <Droppable id={bed.id} key={bed.id} data={{ bed, room, patient: bed.patient }}>
                {({ isOver }) => bed.patient && bed.patient?.id && (
                  <DragCard
                    className={tw('!p-0 !border-0')}
                  >
                    <Draggable id={bed.patient.id + 'roomOverview'} data={{ bed, room, patient: bed.patient }}>
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
                          isSelected={selectedBedId === bed.id}
                          cardDragProperties={{ isOver, isDangerous: true }}
                        />
                      )}
                    </Draggable>
                  </DragCard>
                )}
              </Droppable>
            ) : (
              // Maybe also wrap inside the drag and drop later
              <Droppable key={bed.id} id={bed.id} data={{ bed, room, patient: bed.patient }}>
                {({ isOver, active }) => {
                  const source = active?.data.current

                  if (isOver) {
                    return (
                      <PatientCard
                        bedName={bed.name}
                        patientName={source?.patient?.name ?? ''} // TODO: bad!
                        cardDragProperties={{ isOver }}
                      />
                    )
                  } else {
                    return (
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
                        isSelected={selectedBedId === bed.id}
                      />
                    )
                  }
                }}
              </Droppable>
            )
        )}
      </div>
    </div>
  )
}
