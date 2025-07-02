import type { Translation, TranslationPlural } from '@helpwave/hightide'
import { ConfirmModal } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { useContext, useEffect, useState } from 'react'
import { SolidButton, TextButton } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import {
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table,
  type TableState
} from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
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
  room: TranslationPlural,
  addRoom: string,
  bedCount: string,
  manageBeds: string,
  manage: string,
  dangerZoneText: TranslationPlural,
  deleteConfirmText: TranslationPlural,
}

const defaultRoomListTranslations: Translation<RoomListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    removeSelection: 'Remove Selected',
    deselectAll: 'Deselect All',
    selectAll: 'Select All',
    roomName: 'Room Name',
    room: {
      one: 'Room',
      other: 'Rooms',
    },
    addRoom: 'Add Room',
    bedCount: '#Beds',
    manageBeds: 'Manage Beds',
    manage: 'Manage',
    dangerZoneText: {
      one: 'Deleting a room is a permanent action and cannot be undone. Be careful!',
      other: 'Deleting rooms is a permanent action and cannot be undone. Be careful!',
    },
    deleteConfirmText: {
      one: 'Do you really want to delete the selected room?',
      other: 'Do you really want to delete the selected rooms?',
    },
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    roomName: 'Zimmername',
    room: {
      one: 'Zimmer',
      other: 'Zimmer',
    },
    addRoom: 'Raum hinzufügen',
    bedCount: 'Bettenanzahl',
    manageBeds: 'Betten verwalten',
    manage: 'Verwalten',
    dangerZoneText: {
      one: 'Das Löschen von einem Raum ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
      other: 'Das Löschen von Räumen ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    },
    deleteConfirmText: {
      one: 'Willst du wirklich den ausgewählten Raum löschen?',
      other: 'Willst du wirklich die ausgewählten Räume löschen?',
    },
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
  const translation = useTranslation([defaultRoomListTranslations], overwriteTranslation)
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
      name: translation('room') + (usedRooms.length + 1),
    }
    creatRoomMutation.mutate(newRoom)
  }

  return (
    <div className="col">
      <ConfirmModal
        headerProps={{
          titleText: translation('deleteConfirmText', { count: tableState.selection?.currentSelection.length }),
          descriptionText: translation('dangerZoneText', { count:  tableState.selection?.currentSelection.length }),
        }}
        isOpen={deletionConfirmDialogElement !== undefined}
        onCancel={() => setDeletionConfirmDialogElement(undefined)}
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
        isOpen={!!managedRoom}
        wardId={context.state.wardId}
        roomId={managedRoom ?? ''}
        onClose={() => setManagedRoom(undefined)}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
        errorProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
      >
        <div className="row justify-between items-center mb-2">
          <span className="textstyle-table-name">{translation('room', { count: 2 /* Always use plural */ }) + ` (${usedRooms.length})`}</span>
          <div className="row gap-x-2">
            {(tableState.selection && tableState.selection?.currentSelection.length > 0) && (
              <SolidButton
                onClick={() => setDeletionConfirmDialogElement('')}
                color="negative"
              >
                {translation('removeSelection')}
              </SolidButton>
            )}
            <SolidButton onClick={addRoom} color="positive">
              {translation('addRoom')}
            </SolidButton>
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
            <span key="name" className="textstyle-table-header min-w-48 text-start">{translation('roomName')}</span>,
            <span key="bedcount" className="textstyle-table-header">{translation('bedCount')}</span>,
            <span key="manage" className="textstyle-table-header">{translation('manageBeds')}</span>,
            <></>
          ]}
          rowMappingToCells={room => [
            <div key="name" className="row items-center w-10/12 min-w-[50px]">
              <Input
                value={room.name}
                type="text"
                onChangeText={text => {
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
            <div key="bedcount" className="w-20">
              <span>{room.bedCount}</span>
            </div>,
            <div key="manage" className="row justify-start min-w-[140px]">
              <TextButton onClick={() => setManagedRoom(room.id)}>
                {translation('manage')}
              </TextButton>
            </div>,
            <div key="remove" className="row justify-end">
              <TextButton onClick={() => setDeletionConfirmDialogElement(room.id)} color="negative">
                {translation('remove')}
              </TextButton>
            </div>
          ]}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
