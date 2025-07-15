import { useContext, useEffect } from 'react'
import type { Translation } from '@helpwave/hightide'
import { LoadingAndErrorComponent, type PropsForTranslation, SolidButton, useTranslation } from '@helpwave/hightide'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import { useRoomOverviewsQuery } from '@helpwave/api-services/mutations/tasks/room_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { useUpdates } from '@helpwave/api-services/util/useUpdates'
import { RoomOverview } from '../RoomOverview'
import { WardOverviewContext } from '@/pages/ward/[wardId]'
import { AddCard } from '@/components/cards/AddCard'
import { router } from 'next/client'
import { ColumnTitle } from '@/components/ColumnTitle'

type WardRoomListTranslation = {
  roomOverview: string,
  showPatientList: string,
  addRooms: string,
}

const defaultWardRoomListTranslation: Translation<WardRoomListTranslation> = {
  en: {
    roomOverview: 'Ward Overview',
    showPatientList: 'Show Patient List',
    addRooms: 'Add Rooms',
  },
  de: {
    roomOverview: 'Stationsübersicht',
    showPatientList: 'Patientenliste',
    addRooms: 'Räume hinzufügen',
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
  const translation = useTranslation([defaultWardRoomListTranslation], overwriteTranslation)
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
    <div className="relative col px-6 py-4 @container">
      <ColumnTitle
        title={translation('roomOverview')}
        actions={(
          <SolidButton onClick={event => {
            event.stopPropagation()
            updateContext({ wardId: contextState.wardId })
          }}>
            {translation('showPatientList')}
          </SolidButton>
        )}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {displayableRooms.length > 0 ?
          displayableRooms.map((room, index) => (
            <RoomOverview
              key={index}
              room={room}
            />
          )) : (
            <AddCard
              text={translation('addRooms')}
              onClick={() => router.push(`/organizations/${organization?.id ?? ''}?wardId=${contextState.wardId}`)}
            />
          )}
      </LoadingAndErrorComponent>
    </div>
  )
}
