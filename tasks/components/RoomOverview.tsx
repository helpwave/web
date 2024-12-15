import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useEffect, useRef, useState } from 'react'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import type { BedMinimalDTO } from '@helpwave/api-services/types/tasks/bed'
import type { Gender, PatientDTO } from '@helpwave/api-services/types/tasks/patient'
import { emptyPatient } from '@helpwave/api-services/types/tasks/patient'
import type { AppColor } from '@helpwave/common/twind/config'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { BedCard } from './cards/BedCard'
import { PatientCard } from './cards/PatientCard'
import { Droppable, Draggable } from './dnd-kit-instances/patients'
import { DragCard } from './cards/DragCard'
import { WardOverviewContext } from '@/pages/ward/[wardId]'

type RoomOverviewTranslation = Record<Gender, string>

const defaultRoomOverviewTranslations: Record<Languages, RoomOverviewTranslation> = {
  en: {
    male: 'M',
    female: 'F',
    diverse: 'D',
  },
  de: {
    male: 'M',
    female: 'F',
    diverse: 'D',
  }
}

export type RoomOverviewProps = {
  room: RoomOverviewDTO
}

/**
 * A component to show all beds and patients within a room in a ward
 */
export const RoomOverview = ({ room, overwriteTranslation }: PropsForTranslation<RoomOverviewTranslation, RoomOverviewProps>) => {
  const translation = useTranslation(defaultRoomOverviewTranslations, overwriteTranslation)
  const context = useContext(WardOverviewContext)
  const ref = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)

  // const patients = room.beds.filter(value => value.patient !== null).map(value => value.patient!)
  const gender: Gender | undefined = undefined
  // TODO set gender according to patients

  const genderColorMapping: Record<Gender, AppColor> = {
    male: 'hw-male',
    female: 'hw-female',
    diverse: 'hw-diverse',
  }
  const usedColor = genderColorMapping[gender ?? 'diverse']

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
        <div className={tw(`w-3 h-3 mx-2 rounded-full bg-${usedColor}-400`)}/>
        <div className={tw('flex flex-row items-center gap-x-2')}>
          <Span type="subsectionTitle">{room.name}</Span>
          {gender && <Span type="description" className="text-sm font-semibold">({translation[gender]})</Span>}
        </div>
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
                          openTasks={bed.patient.tasksUnscheduled}
                          onTileClick={(event) => {
                            event.stopPropagation()
                            if (bed.patient) {
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
