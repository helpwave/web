import { useContext, useEffect, useState } from 'react'
import type { Translation } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  type PropsForTranslation,
  range,
  SolidButton,
  useTranslation
} from '@helpwave/hightide'
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
import { AddPatientModal, type AddPatientModalValue } from '@/components/modals/AddPatientModal'
import { usePatientCreateMutation } from '@helpwave/api-services/mutations/tasks/patient_mutations'

type WardRoomListTranslation = {
  roomOverview: string,
  showPatientList: string,
  addRooms: string,
  patient: string,
}

const defaultWardRoomListTranslation: Translation<WardRoomListTranslation> = {
  en: {
    roomOverview: 'Ward Overview',
    showPatientList: 'Show Patient List',
    addRooms: 'Add Rooms',
    patient: 'Patient',
  },
  de: {
    roomOverview: 'Stationsübersicht',
    showPatientList: 'Patientenliste',
    addRooms: 'Räume hinzufügen',
    patient: 'Patient',
  }
}

type AddModalState = {
  value: AddPatientModalValue,
  isOpen: boolean,
}

export type WardRoomListProps = {
  selectedBed?: BedWithPatientWithTasksNumberDTO,
  rooms?: RoomOverviewDTO[],
  wardId: string,
}

/**
 * The left side component of the page showing all Rooms of a Ward
 */
export const WardRoomList = ({
                               overwriteTranslation,
                               rooms,
                               wardId
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

  const createPatientMutation = usePatientCreateMutation()
  const [addModalState, setAddModalState] = useState<AddModalState>({
    value: {
      name: ''
    },
    isOpen: false
  })

  return (
    <div className="relative col px-6 py-4 @container">
      <AddPatientModal
        isOpen={addModalState.isOpen}
        onCancel={() => setAddModalState({ value: { name: '' }, isOpen: false })}
        onConfirm={() => {
          createPatientMutation.mutate({
            id: '',
            humanReadableIdentifier: addModalState.value.name,
            bedId: addModalState.value.bedId,
            notes: '',
            tasks: [],
          })
          setAddModalState({ value: { name: '' }, isOpen: false })
        }}
        onValueChange={(value) => setAddModalState(prevState => ({ ...prevState, value }))}
        value={addModalState.value}
        wardId={wardId}
      />
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
              onBedClick={(bed) => {
                if (bed.patient) {
                  updateContext({
                    patientId: bed.patient.id,
                    bedId: bed.id,
                    wardId: room.wardId,
                  })
                  return
                }
                setAddModalState({
                  value: {
                    name: `${translation('patient')} ${range(3).map(() => Math.floor(Math.random() * 10)).map(String).join('')}`,
                    bedId: bed.id,
                    roomId: room.id,
                  },
                  isOpen: true
                })
              }}
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
