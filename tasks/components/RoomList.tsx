import type { Translation, TranslationPlural } from '@helpwave/hightide'
import { FillerRowElement } from '@helpwave/hightide'
import { InputUncontrolled } from '@helpwave/hightide'
import {
  ConfirmModal,
  LoadingAndErrorComponent,
  type PropsForTranslation,
  SolidButton,
  TableWithSelection,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import { useContext, useMemo, useState } from 'react'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
import {
  useRoomCreateMutation,
  useRoomDeleteMutation,
  useRoomOverviewsQuery,
  useRoomUpdateMutation
} from '@helpwave/api-services/mutations/tasks/room_mutations'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'
import { ManageBedsModal } from '@/components/modals/ManageBedsModal'
import { ColumnTitle } from '@/components/ColumnTitle'
import { Plus, Trash } from 'lucide-react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'

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

type DeleteDialogState = {
  isShowing: boolean,
  /** If not set, the entire selection will be deleted */
  value?: RoomOverviewDTO,
}

export type RoomListProps = {
  roomsPerPage?: number,
}

/**
 * A table for showing and editing the rooms within a ward
 */
export const RoomList = ({
                           overwriteTranslation,
                           roomsPerPage = 5
                         }: PropsForTranslation<RoomListTranslation, RoomListProps>) => {
  const translation = useTranslation([defaultRoomListTranslations], overwriteTranslation)
  const context = useContext(OrganizationOverviewContext)
  const [selectionState, setSelectionState] = useState<RowSelectionState>({})
  const [deleteRoomDialogState, setDeleteRoomDialogState] = useState<DeleteDialogState>({ isShowing: false })
  const [managedRoom, setManagedRoom] = useState<string>()

  const creatRoomMutation = useRoomCreateMutation()
  const deleteRoomMutation = useRoomDeleteMutation()
  const updateRoomMutation = useRoomUpdateMutation()

  const { data: rooms, isError, isLoading } = useRoomOverviewsQuery(context.state.wardId) // TODO use a more light weight query

  const minRoomNameLength = 1
  const maxRoomNameLength = 32

  const columns = useMemo<ColumnDef<RoomOverviewDTO>[]>(() => [
    {
      id: 'room',
      header: translation('roomName'),
      cell: ({ cell }) => {
        const room = (rooms ?? [])[cell.row.index]!
        return (
          <InputUncontrolled
            value={room.name}
            type="text"
            onEditCompleted={(text) => {
              updateRoomMutation.mutate({
                ...room,
                name: text
              })
            }}
            id={room.name}
            minLength={minRoomNameLength}
            maxLength={maxRoomNameLength}
            className="w-full"
          />
        )
      },
      accessorKey: 'name',
      sortingFn: 'text',
      minSize: 200,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'bedCount',
      header: translation('bedCount'),
      accessorFn: room => room.beds.length,
      sortingFn: 'text',
      minSize: 190,
      meta: {
        filterType: 'range'
      }
    },
    {
      id: 'manage',
      header: translation('manageBeds'),
      cell: ({ cell }) => {
        const room = (rooms ?? [])[cell.row.index]!
        return (
          <TextButton onClick={() => setManagedRoom(room.id)} color="primary">
            {translation('manage')}
          </TextButton>
        )
      },
      minSize: 160,
      maxSize: 200,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        const room = (rooms ?? [])[cell.row.index]!
        return (
          <TextButton
            onClick={() => setDeleteRoomDialogState({ isShowing: true, value: room })}
            color="negative"
          >
            {translation('remove')}
          </TextButton>
        )
      },
      minSize: 140,
      maxSize: 140,
      enableResizing: false,
    }
  ], [translation, updateRoomMutation, rooms])

  const selectedElementCount = Object.keys(selectionState).length

  return (
    <div className="col gap-y-4">
      <ConfirmModal
        headerProps={{
          titleText: translation('deleteConfirmText', { count: selectedElementCount }),
          descriptionText: translation('dangerZoneText', { count: selectedElementCount }),
        }}
        isOpen={deleteRoomDialogState.isShowing}
        onCancel={() => setDeleteRoomDialogState({ isShowing: false })}
        onConfirm={() => {
          if (deleteRoomDialogState.value) {
            if (selectionState[deleteRoomDialogState.value.id]) {
              const newSelection = { ...selectionState }
              delete newSelection[deleteRoomDialogState.value.id]
              setSelectionState(newSelection)
            }
            deleteRoomMutation.mutate(deleteRoomDialogState.value.id)
          } else {
            Object.keys(selectionState).forEach(value => {
              const room = (rooms ?? []).find(room => room.id === value)
              if (room) {
                deleteRoomMutation.mutate(room.id)
              }
            })
            setSelectionState({})
          }
          setDeleteRoomDialogState({ isShowing: false })
        }}
        confirmType="negative"
      />
      <ManageBedsModal
        isOpen={!!managedRoom}
        wardId={context.state.wardId}
        roomId={managedRoom ?? ''}
        onClose={() => setManagedRoom(undefined)}
      />
      <ColumnTitle
        title={translation('room', { count: 2 /* Always use plural */ }) + ((!isLoading && !isError) ? ` (${rooms.length})` : '')}
        actions={!isLoading && !isError && (
          <div className="row gap-x-2">
            {(selectedElementCount > 0) && (
              <SolidButton
                onClick={() => setDeleteRoomDialogState({ isShowing: true })}
                color="negative"
                size="small"
                startIcon={<Trash size={18}/>}
              >
                {translation('removeSelection')}
              </SolidButton>
            )}
            <SolidButton
              onClick={() => {
                creatRoomMutation.mutate({
                  id: '',
                  name: translation('room') + ' ' + (rooms.length + 1),
                  wardId: context.state.wardId
                })
              }}
              color="positive"
              size="small"
              startIcon={<Plus size={18}/>}
            >
              {translation('addRoom')}
            </SolidButton>
          </div>
        )}
        type="subtitle"
      />
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        className="min-h-101"
      >
        {rooms && (
          <TableWithSelection
            data={rooms}
            columns={columns}
            rowSelection={selectionState}
            onRowSelectionChange={setSelectionState}
            disableClickRowClickSelection={true}
            fillerRow={() => (<FillerRowElement className="h-10"/>)}
            initialState={{
              pagination: { pageSize: roomsPerPage }
            }}
          />
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
