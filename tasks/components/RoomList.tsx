import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Span } from '@helpwave/common/components/Span'
import { OrganizationOverviewContext } from '../pages/organizations/[uuid]'
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
  changeTableSelectionSingle,
  defaultTableStatePagination,
  defaultTableStateSelection, removeFromTableSelection,
  Table
} from '@helpwave/common/components/Table'

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
    bedCount: 'Number of Beds',
    dangerZoneText: (single) => `Deleting ${single ? defaultRoomListTranslations.en.room : defaultRoomListTranslations.en.rooms} is a permanent action and cannot be undone. Be careful!`,
    deleteConfirmText: (single) => `Do you really want to delete the selected ${single ? defaultRoomListTranslations.en.room : defaultRoomListTranslations.en.rooms}?`,
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    roomName: 'Raum Name',
    room: 'Raum',
    rooms: 'Räume',
    addRoom: 'Raum hinzufügen',
    bedCount: 'Bettenanzahl',
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

  const identifierMapping = (dataObject: RoomOverviewDTO) => dataObject.id
  const creatRoomMutation = useRoomCreateMutation((room) => {
    context.updateContext({ ...context.state })
    setFocusElement({ ...emptyRoomOverview, id: room.id })
  }, context.state.wardID ?? '') // Not good but should be safe most of the time
  const deleteRoomMutation = useRoomDeleteMutation(() => context.updateContext({ ...context.state }))
  const updateRoomMutation = useRoomUpdateMutation(() => context.updateContext({ ...context.state }))

  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardID) // TODO use a more light weight query

  useEffect(() => {
    if (data && !isEditing) {
      setUsedRooms(data)
    }
  }, [data, isEditing])
  const [isShowingDeletionConfirmDialog, setDeletionConfirmDialogState] = useState(false)

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

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  const hasSelectedMultiple = !!tableState.selection && tableState.selection?.currentSelection.length > 1

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        title={translation.deleteConfirmText(!hasSelectedMultiple)}
        description={translation.dangerZoneText(!hasSelectedMultiple)}
        isOpen={isShowingDeletionConfirmDialog}
        onCancel={() => setDeletionConfirmDialogState(false)}
        onBackgroundClick={() => setDeletionConfirmDialogState(false)}
        onConfirm={() => {
          const toDeleteElements = usedRooms.filter(value => tableState.selection?.currentSelection.includes(identifierMapping(value)))
          toDeleteElements.forEach(value => deleteRoomMutation.mutate(value.id))
          setTableState(removeFromTableSelection(tableState, toDeleteElements, usedRooms.length, identifierMapping))
          setDeletionConfirmDialogState(false)
        }}
        confirmType="negative"
      />
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <Span type="tableName">{translation.rooms + ` (${usedRooms.length})`}</Span>
        <div className={tw('flex flex-row gap-x-2')}>
          {(tableState.selection && tableState.selection?.currentSelection.length > 0) && (
            <Button
              onClick={() => setDeletionConfirmDialogState(true)}
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
          <></>
        ]}
        rowMappingToCells={dataObject => [
          <div key="name" className={tw('flex flex-row items-center w-10/12 min-w-[50px]')}>
            <Input
              value={dataObject.name}
              type="text"
              onChange={text => {
                setIsEditing(true)
                setUsedRooms(usedRooms.map(value => identifierMapping(value) === identifierMapping(dataObject) ? {
                  ...dataObject,
                  name: text
                } : value))
                setFocusElement(dataObject)
              }}
              onEditCompleted={(text) => {
                updateRoomMutation.mutate({
                  ...dataObject,
                  name: text
                })
                setIsEditing(false)
              }} // TODO update to somthing better than blur
              id={dataObject.name}
              minLength={minRoomNameLength}
              maxLength={maxRoomNameLength}
            />
          </div>,
          <div key="bedcount" className={tw('w-20')}>
            <Input
              value={dataObject.beds.length.toString()}
              type="number"
              onBlur={() => updateRoomMutation.mutate({
                ...dataObject,
                // bedCount: parseInt(text) TODO use bedcount change
              })} // TODO update to somthing better than blur
              min={1}
              id={dataObject.id + 'bedCount'}
            />
          </div>,
          <div key="remove" className={tw('flex flex-row justify-end')}>
            <Button
              onClick={() => {
                setTableState(changeTableSelectionSingle(tableState, dataObject, usedRooms.length, identifierMapping))
                setDeletionConfirmDialogState(true)
              }}
              color="negative"
              variant="textButton"
            >
              {translation.remove}
            </Button>
          </div>
        ]}
      />
    </div>
  )
}
