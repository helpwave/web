import { useContext, useRef } from 'react'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import { BedCard } from './cards/BedCard'
import { PatientCard } from './cards/PatientCard'
import { WardOverviewDraggable, WardOverviewDroppable } from './dnd-kit-instances/patients'
import { DragCard } from './cards/DragCard'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import { noop } from '@helpwave/hightide'

export type RoomOverviewProps = {
  room: RoomOverviewDTO,
  onBedClick?: (bed: BedWithPatientWithTasksNumberDTO) => void,
}

/**
 * A component to show all beds and patients within a room in a ward
 */
export const RoomOverview = ({ room, onBedClick = noop }: RoomOverviewProps) => {
  const context = useContext(WardOverviewContext)
  const ref = useRef<HTMLDivElement>(null)

  const selectedBedId = context.state.bedId

  return (
    <div className="col gap-y-1 w-full @container" ref={ref}>
      <div className="row gap-x-1 items-center">
        <div className="w-2 h-2 mx-2 rounded-full bg-gray-300"/>
        <span className="textstyle-title-normal">{room.name}</span>
      </div>
      <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
        {room.beds.map((bed, index) => {
          const patient = bed.patient
          if (patient) {
            return (
              <WardOverviewDroppable id={bed.id} key={index} data={{ type: 'bed', bed, room, patient }}>
                {({ active, isOver }) => {
                  const activeData = active?.data?.current
                  const isOriginalBed = activeData?.patient?.id === patient.id
                  return (
                    <DragCard className="!p-0 !border-0">
                      <WardOverviewDraggable
                        id={patient.id + 'roomOverview'}
                        data={{ type: 'assignedPatient', bed, room, patient }}
                      >
                        {() => {
                          if(isOriginalBed && !isOver) {
                            return (
                              <BedCard
                                bedName={bed.name}
                                isSelected={selectedBedId === bed.id}
                              />
                            )
                          }
                          return (
                            <PatientCard
                              bedName={bed.name}
                              patientName={patient.humanReadableIdentifier}
                              taskCounts={{
                                done: patient.tasksDone,
                                inProgress: patient.tasksInProgress,
                                todo: patient.tasksTodo,
                              }}
                              onClick={() => {
                                onBedClick(bed)
                              }}
                              isSelected={selectedBedId === bed.id}
                              cardDragProperties={{ isOver, isDangerous: !isOriginalBed }}
                            />
                          )
                        }}
                      </WardOverviewDraggable>
                    </DragCard>
                  )
                }}
              </WardOverviewDroppable>
            )
          }
          return (
            <WardOverviewDroppable key={bed.id} id={bed.id} data={{ type: 'bed', bed, room, patient: bed.patient }}>
              {({ isOver, active }) => {
                const activeData = active?.data.current

                if (isOver && activeData) {
                  return (
                    <PatientCard
                      bedName={bed.name}
                      patientName={activeData.patient.humanReadableIdentifier}
                      cardDragProperties={{ isOver }}
                    />
                  )
                } else {
                  return (
                    <BedCard
                      bedName={bed.name}
                      onClick={() => onBedClick(bed)}
                      isSelected={selectedBedId === bed.id}
                    />
                  )
                }
              }}
            </WardOverviewDroppable>
          )
        })}
      </div>
    </div>
  )
}
