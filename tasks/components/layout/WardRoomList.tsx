import { useContext, useEffect } from 'react'

import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton } from '@helpwave/common/components/Button'
import Link from 'next/link'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import { useRoomOverviewsQuery } from '@helpwave/api-services/mutations/tasks/room_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { RoomOverview } from '../RoomOverview'
import { WardOverviewContext } from '@/pages/ward/[wardId]'

type WardRoomListTranslation = {
  roomOverview: string,
  showPatientList: string,
  editWard: string,
  noRooms: string,
}

const defaultWardRoomListTranslation: Record<Languages, WardRoomListTranslation> = {
  en: {
    roomOverview: 'Ward Overview',
    showPatientList: 'Show Patient List',
    editWard: 'Edit Ward',
    noRooms: 'This Ward has no rooms with beds.'
  },
  de: {
    roomOverview: 'Stationsübersicht',
    showPatientList: 'Patientenliste',
    editWard: 'Station bearbeiten',
    noRooms: 'Diese Station hat keine Räume mit Betten.'
  }
}

export type WardRoomListProps = {
  selectedBed?: BedWithPatientWithTasksNumberDTO,
  rooms?: RoomOverviewDTO[],
}

/**
 * The left side component of the page showing all Rooms of a Ward
 */
export const WardRoomList = ({
  overwriteTranslation,
  rooms
}: PropsForTranslation<WardRoomListTranslation, WardRoomListProps>) => {
  const translation = useTranslation(defaultWardRoomListTranslation, overwriteTranslation)
  const {
    state: contextState,
    updateContext
  } = useContext(WardOverviewContext)
  const {
    data,
    isError,
    isLoading,
    refetch
  } = useRoomOverviewsQuery(contextState.wardId)
  const { organization } = useAuth()

  const displayableRooms = (rooms ?? data ?? []).filter(room => room.beds.length > 0)

  const { observeAttribute } = useUpdates()
  useEffect(() => {
    const subscription = observeAttribute('aggregateType', 'patient').subscribe(() => refetch())
    return () => {
      subscription.unsubscribe()
    }
  }, [observeAttribute, refetch])

  return (
    <div className="col px-6 py-4"
         onClick={() => updateContext({ wardId: contextState.wardId })}
    >
      <div className="row justify-between items-center pb-4">
        <span className="textstyle-title-md">{translation.roomOverview}</span>
        <SolidButton onClick={event => {
          event.stopPropagation()
          updateContext({ wardId: contextState.wardId })
        }}>
          {translation.showPatientList}
        </SolidButton>
      </div>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {displayableRooms.length > 0 ?
          displayableRooms.map(room => (
            <RoomOverview
              key={room.id}
              room={room}
            />
          )) : (
            <div className="col gap-y-2 items-center">
              <span>{translation.noRooms}</span>
              <Link href={`/organizations/${organization?.id ?? ''}?wardId=${contextState.wardId}`}>
                <SolidButton>{translation.editWard}</SolidButton>
              </Link>
            </div>
          )}
      </LoadingAndErrorComponent>
    </div>
  )
}
