import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Span } from '@helpwave/common/components/Span'
import { OrganizationOverviewContext } from '../pages/organizations/[id]'
import type { RoomOverviewDTO } from '../mutations/room_mutations'
import {
  emptyRoomOverview,
  useRoomCreateMutation,
  useRoomDeleteMutation,
  useRoomOverviewsQuery,
  useRoomUpdateMutation
} from '../mutations/room_mutations'
import type {
  TableState
} from '@helpwave/common/components/Table'
import {
  defaultTableStatePagination,
  defaultTableStateSelection, removeFromTableSelection,
  Table
} from '@helpwave/common/components/Table'
import { ManageBedsModal } from './MangeBedsModal'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

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
  deleteConfirmText: (single: boolean) => string
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
    rooms: 'Räume',
    addRoom: 'Raum hinzufügen',
    bedCount: 'Bettenanzahl',
    manageBeds: 'Betten verwalten',
    manage: 'Verwalten',
    dangerZoneText: (single) => `Das Löschen von ${single ? `einem ${defaultRoomListTranslations.de.room}` : defaultRoomListTranslations.de.rooms} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich ${single ? 'den' : 'die'} ausgewählten ${single ? defaultRoomListTranslations.de.room : defaultRoomListTranslations.de.rooms} löschen?`,
  }
}

export type RoomListProps = {
  rooms?: RoomOverviewDTO[], // TODO replace with more optimized RoonDTO
  roomsPerPage?: number
}

/**
 * A table for showing and editing the rooms within a ward
 */
export const RoomList = ({
  language,
  rooms
}: PropsWithLanguage<RoomListTranslation, RoomListProps>) => {
  const translation = useTranslation(language, defaultRoomListTranslations)
  const context = useContext(OrganizationOverviewContext)
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination,
    selection: defaultTableStateSelection
  })
  const [usedRooms, setUsedRooms] = useState<RoomOverviewDTO[]>(rooms ?? [])
  const [focusElement, setFocusElement] = useState<RoomOverviewDTO>()
  const [isEditing, setIsEditing] = useState(false)
  const [managedRoom, setManagedRoom] = useState<string>()

  const identifierMapping = (dataObject: RoomOverviewDTO) => dataObject.id
  const creatRoomMutation = useRoomCreateMutation((room) => {
    context.updateContext({ ...context.state })
    setFocusElement({ ...emptyRoomOverview, id: room.id })
  }, context.state.wardId ?? '') // Not good but should be safe most of the time
  const deleteRoomMutation = useRoomDeleteMutation(() => context.updateContext({ ...context.state }))
  const updateRoomMutation = useRoomUpdateMutation(() => context.updateContext({ ...context.state }))

  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardId) // TODO use a more light weight query

  useEffect(() => {
    if (data && !isEditing) {
      setUsedRooms(data)
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
      name: 'room' + (usedRooms.length + 1),
    }
    creatRoomMutation.mutate(newRoom)
  }

  const multipleInDelete = deletionConfirmDialogElement !== '' || tableState.selection?.currentSelection.length === 1

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        id="roomlist-DeleteBedsDialog"
        title={translation.deleteConfirmText(multipleInDelete)}
        description={translation.dangerZoneText(multipleInDelete)}
        isOpen={deletionConfirmDialogElement !== undefined}
        onCancel={() => setDeletionConfirmDialogElement(undefined)}
        onBackgroundClick={() => setDeletionConfirmDialogElement(undefined)}
        onConfirm={() => {
          let toDeleteElements: RoomOverviewDTO[]
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
        onClose={() => setManagedRoom(undefined)}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
        errorProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
      >
        <div className={tw('flex flex-row justify-between items-center mb-2')}>
          <Span type="tableName">{translation.rooms + ` (${usedRooms.length})`}</Span>
          <div className={tw('flex flex-row gap-x-2')}>
            {(tableState.selection && tableState.selection?.currentSelection.length > 0) && (
              <Button
                onClick={() => setDeletionConfirmDialogElement('')}
                color="negative"
              >
                {translation.removeSelection}
              </Button>
            )}
            <Button onClick={addRoom} color="positive">
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
            <Span key="name" type="tableHeader">{translation.roomName}</Span>,
            <Span key="bedcount" type="tableHeader">{translation.bedCount}</Span>,
            <Span key="manage" type="tableHeader" >{translation.manageBeds}</Span>,
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
              <Span>{room.beds.length}</Span>
            </div>,
            <div key="manage" className={tw('flex flex-row justify-start min-w-[140px]')}>
              <Button
                onClick={() => setManagedRoom(room.id)}
                variant="textButton"
                color="neutral"
              >
                {translation.manage}
              </Button>
            </div>,
            <div key="remove" className={tw('flex flex-row justify-end')}>
              <Button
                onClick={() => setDeletionConfirmDialogElement(room.id)}
                color="negative"
                variant="textButton"
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
