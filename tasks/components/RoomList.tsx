import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user-input/Input'
import {
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table,
  type TableState
} from '@helpwave/common/components/Table'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import type { RoomMinimalDTO } from '@helpwave/api-services/types/tasks/room'
import {
  useRoomCreateMutation,
  useRoomDeleteMutation, useRoomOverviewsQuery,
  useRoomUpdateMutation
} from '@helpwave/api-services/mutations/tasks/room_mutations'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'
import { ManageBedsModal } from '@/components/modals/ManageBedsModal'

type RoomListTranslation = {
  edit: string,
  remove: string,
  removeSelection: string,
  deselectAll: string,
  selectAll: string,
  roomName: string,
  room: string,
  rooms: string,
  addRoom: string,
  bedCount: string,
  manageBeds: string,
  manage: string,
  dangerZoneText: (single: boolean) => string,
  deleteConfirmText: (single: boolean) => string,
}

const defaultRoomListTranslations: Record<Languages, RoomListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    removeSelection: 'Remove Selected',
    deselectAll: 'Deselect All',
    selectAll: 'Select All',
    roomName: 'Room Name',
    room: 'Room',
    rooms: 'Rooms',
    addRoom: 'Add Room',
    bedCount: '#Beds',
    manageBeds: 'Manage Beds',
    manage: 'Manage',
    dangerZoneText: (single) => `Deleting ${single ? defaultRoomListTranslations.en.room : defaultRoomListTranslations.en.rooms} is a permanent action and cannot be undone. Be careful!`,
    deleteConfirmText: (single) => `Do you really want to delete the selected ${single ? defaultRoomListTranslations.en.room : defaultRoomListTranslations.en.rooms}?`,
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    roomName: 'Zimmer',
    room: 'Raum',
    rooms: 'Zimmer',
    addRoom: 'Raum hinzufügen',
    bedCount: 'Bettenanzahl',
    manageBeds: 'Betten verwalten',
    manage: 'Verwalten',
    dangerZoneText: (single) => `Das Löschen von ${single ? `einem ${defaultRoomListTranslations.de.room}` : defaultRoomListTranslations.de.rooms} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich ${single ? 'den' : 'die'} ausgewählten ${single ? defaultRoomListTranslations.de.room : defaultRoomListTranslations.de.rooms} löschen?`,
  }
}

export type RoomListRoomRepresentation = RoomMinimalDTO & {
  bedCount: number,
}

export type RoomListProps = {
  rooms?: RoomListRoomRepresentation[], // TODO replace with more optimized RoomDTO
  roomsPerPage?: number,
}

/**
 * A table for showing and editing the rooms within a ward
 */
export const RoomList = ({
  overwriteTranslation,
  rooms
}: PropsForTranslation<RoomListTranslation, RoomListProps>) => {
  const translation = useTranslation(defaultRoomListTranslations, overwriteTranslation)
  const context = useContext(OrganizationOverviewContext)
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination,
    selection: defaultTableStateSelection
  })
  const [usedRooms, setUsedRooms] = useState<RoomListRoomRepresentation[]>(rooms ?? [])
  const [focusElement, setFocusElement] = useState<RoomListRoomRepresentation>()
  const [isEditing, setIsEditing] = useState(false)
  const [managedRoom, setManagedRoom] = useState<string>()

  const identifierMapping = (dataObject: RoomListRoomRepresentation) => dataObject.id
  const creatRoomMutation = useRoomCreateMutation((room) => {
    context.updateContext({ ...context.state })
    setFocusElement({ ...room, bedCount: 0 })
    setUsedRooms(prevState => [...prevState, { ...room, bedCount: 0 }])
  }, context.state.wardId ?? '') // Not good but should be safe most of the time
  const deleteRoomMutation = useRoomDeleteMutation(() => {
    context.updateContext({ ...context.state })
    setFocusElement(undefined)
  })
  const updateRoomMutation = useRoomUpdateMutation(() => context.updateContext({ ...context.state }))

  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardId) // TODO use a more light weight query

  useEffect(() => {
    if (data && !isEditing) {
      setUsedRooms(data.map(room => ({
        id: room.id,
        name: room.name,
        bedCount: room.beds.length
      })))
    }
  }, [data, isEditing])
  // undefined = dont show
  // ""        = take selcted
  // "<id>"    = only the id
  const [deletionConfirmDialogElement, setDeletionConfirmDialogElement] = useState<string>()

  const minRoomNameLength = 1
  const maxRoomNameLength = 32

  const addRoom = () => {
    // TODO remove below for an actual room add
    const newRoom = {
      id: '',
      name: translation.room + (usedRooms.length + 1),
    }
    creatRoomMutation.mutate(newRoom)
  }

  const multipleInDelete = deletionConfirmDialogElement !== '' || tableState.selection?.currentSelection.length === 1

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        id="roomlist-DeleteBedsDialog"
        titleText={translation.deleteConfirmText(multipleInDelete)}
        descriptionText={translation.dangerZoneText(multipleInDelete)}
        isOpen={deletionConfirmDialogElement !== undefined}
        onCancel={() => setDeletionConfirmDialogElement(undefined)}
        onBackgroundClick={() => setDeletionConfirmDialogElement(undefined)}
        onCloseClick={() => setDeletionConfirmDialogElement(undefined)}
        onConfirm={() => {
          let toDeleteElements: RoomListRoomRepresentation[]
          if (deletionConfirmDialogElement) {
            toDeleteElements = usedRooms.filter(value => identifierMapping(value) === deletionConfirmDialogElement)
          } else {
            toDeleteElements = usedRooms.filter(value => tableState.selection?.currentSelection.includes(identifierMapping(value)))
          }
          toDeleteElements.forEach(value => deleteRoomMutation.mutate(value.id))
          setTableState(removeFromTableSelection(tableState, toDeleteElements, usedRooms.length, identifierMapping))
          setDeletionConfirmDialogElement(undefined)
        }}
        confirmType="negative"
      />
      <ManageBedsModal
        id="roomlist-ManageBedModal"
        isOpen={!!managedRoom}
        wardId={context.state.wardId}
        roomId={managedRoom ?? ''}
        onBackgroundClick={() => setManagedRoom(undefined)}
        onCloseClick={() => setManagedRoom(undefined)}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
        errorProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
      >
        <div className={tw('flex flex-row justify-between items-center mb-2')}>
          <span className={tw('textstyle-table-name')}>{translation.rooms + ` (${usedRooms.length})`}</span>
          <div className={tw('flex flex-row gap-x-2')}>
            {(tableState.selection && tableState.selection?.currentSelection.length > 0) && (
              <Button
                onClick={() => setDeletionConfirmDialogElement('')}
                color="hw-negative"
              >
                {translation.removeSelection}
              </Button>
            )}
            <Button onClick={addRoom} color="hw-positive">
              {translation.addRoom}
            </Button>
          </div>
        </div>
        <Table
          focusElement={focusElement}
          data={usedRooms}
          stateManagement={[tableState, tableState => {
            setTableState(tableState)
            setFocusElement(undefined)
          }]}
          identifierMapping={identifierMapping}
          header={[
            <span key="name" className={tw('textstyle-table-header')}>{translation.roomName}</span>,
            <span key="bedcount" className={tw('textstyle-table-header')}>{translation.bedCount}</span>,
            <span key="manage" className={tw('textstyle-table-header')}>{translation.manageBeds}</span>,
            <></>
          ]}
          rowMappingToCells={room => [
            <div key="name" className={tw('flex flex-row items-center w-10/12 min-w-[50px]')}>
              <Input
                value={room.name}
                type="text"
                onChange={text => {
                  setIsEditing(true)
                  setUsedRooms(usedRooms.map(value => identifierMapping(value) === identifierMapping(room) ? {
                    ...room,
                    name: text
                  } : value))
                  setFocusElement(room)
                }}
                onEditCompleted={(text) => {
                  updateRoomMutation.mutate({
                    ...room,
                    name: text
                  })
                  setIsEditing(false)
                }}
                id={room.name}
                minLength={minRoomNameLength}
                maxLength={maxRoomNameLength}
              />
            </div>,
            <div key="bedcount" className={tw('w-20')}>
              <span>{room.bedCount}</span>
            </div>,
            <div key="manage" className={tw('flex flex-row justify-start min-w-[140px]')}>
              <Button
                onClick={() => setManagedRoom(room.id)}
                variant="text"
                color="hw-neutral"
              >
                {translation.manage}
              </Button>
            </div>,
            <div key="remove" className={tw('flex flex-row justify-end')}>
              <Button
                onClick={() => setDeletionConfirmDialogElement(room.id)}
                color="hw-negative"
                variant="text"
              >
                {translation.remove}
              </Button>
            </div>
          ]}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
