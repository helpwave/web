import type { CoreCell } from '@tanstack/react-table'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useState } from 'react'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Pagination } from '@helpwave/common/components/Pagination'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Checkbox } from '@helpwave/common/components/user_input/Checkbox'
import { Span } from '@helpwave/common/components/Span'
import { OrganizationOverviewContext } from '../pages/organizations/[uuid]'
import type { RoomOverviewDTO } from '../mutations/room_mutations'
import {
  useRoomCreateMutation,
  useRoomDeleteMutation,
  useRoomOverviewsQuery,
  useRoomUpdateMutation
} from '../mutations/room_mutations'

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
    dangerZoneText: (single) => `Das Löschen von ${single ? defaultRoomListTranslations.de.room : defaultRoomListTranslations.de.rooms} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich die ausgewählten ${single ? defaultRoomListTranslations.de.room : defaultRoomListTranslations.de.rooms} löschen?`,
  }
}

export type RoomListProps = {
  rooms?: RoomOverviewDTO[], // TODO replace with more optimized RoonDTO
  roomsPerPage?: number
}

const columnHelper = createColumnHelper<RoomOverviewDTO>()

const columns = [
  columnHelper.display({
    id: 'select',
  }),
  columnHelper.accessor('name', {
    id: 'name',
  }),
  columnHelper.accessor('beds', {
    id: 'bedCount',
  }),
  columnHelper.display({
    id: 'remove',
  }),
]

/**
 * A table for showing and editing the rooms within a ward
 */
export const RoomList = ({
  language,
  roomsPerPage = 5,
  rooms
}: PropsWithLanguage<RoomListTranslation, RoomListProps>) => {
  const translation = useTranslation(language, defaultRoomListTranslations)
  const context = useContext(OrganizationOverviewContext)

  const creatRoomMutation = useRoomCreateMutation(() => {
    context.updateContext({ ...context.state })
  }, context.state.wardID ?? '') // Not good but should be safe most of the time
  const deleteRoomMutation = useRoomDeleteMutation(() => context.updateContext({ ...context.state }))
  const updateRoomMutation = useRoomUpdateMutation(() => context.updateContext({ ...context.state }))

  const { data, isError, isLoading } = useRoomOverviewsQuery(context.state.wardID) // TODO use a more light weight query

  const usedRooms = rooms ?? data ?? [] // TODO fix later

  type ConfirmDialogState = {
    display: boolean,
    single: CoreCell<RoomOverviewDTO, unknown> | null
  }
  const defaultState: ConfirmDialogState = { display: false, single: null }
  const [stateDeletionConfirmDialog, setDeletionConfirmDialogState] = useState(defaultState)
  const resetDeletionConfirmDialogState = () => setDeletionConfirmDialogState(defaultState)

  const minRoomNameLength = 1
  const maxRoomNameLength = 32

  const table = useReactTable({
    data: usedRooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: roomsPerPage } }
  })

  const addRoom = () => {
    const defaultBedCount = 3
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

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        title={translation.deleteConfirmText(Boolean(stateDeletionConfirmDialog.single || table.getSelectedRowModel().rows.length <= 1))}
        description={translation.dangerZoneText(Boolean(stateDeletionConfirmDialog.single || table.getSelectedRowModel().rows.length <= 1))}
        isOpen={stateDeletionConfirmDialog.display}
        onCancel={() => resetDeletionConfirmDialogState()}
        onBackgroundClick={() => resetDeletionConfirmDialogState()}
        onConfirm={() => {
          if (stateDeletionConfirmDialog.single) {
            usedRooms.filter(value => value === stateDeletionConfirmDialog.single?.row.original).forEach(value => deleteRoomMutation.mutate(value.id))
          } else {
            table.toggleAllRowsSelected(false)
            usedRooms.filter(value => table.getSelectedRowModel().rows.find(row => row.original === value)).forEach(value => deleteRoomMutation.mutate(value.id))
          }
          resetDeletionConfirmDialogState()
        }}
        confirmType="negative"
      />
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <Span type="tableName">{translation.rooms + ` (${usedRooms.length})`}</Span>
        <div className={tw('flex flex-row gap-x-2')}>
          {(table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected()) && (
          <Button
            onClick={() => setDeletionConfirmDialogState({
              display: true,
              single: null
            })}
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
      <table>
        <thead className={tw('after:block after:h-1 after:w-full')}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : {
                      select:
                      (<div className={tw('flex flex-row pr-4')}>
                          <Checkbox
                            checked={table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
                            onChange={() => table.toggleAllRowsSelected()}
                          />
                        </div>
                      ),
                      name:
                      (<div className={tw('flex flex-row')}>
                        <Span type="tableHeader">{translation.roomName}</Span>
                      </div>),
                      bedCount:
                      (<div className={tw('flex flex-row')}>
                        <Span type="tableHeader">{translation.bedCount}</Span>
                      </div>),
                      remove: (<div />),
                    }[header.column.id]
                }
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody className={tw('before:h-2 before:block border-t-2 before:w-full')}>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {{
                  bedCount: (
                    <div className={tw('w-20')}>
                      <Input
                        value={cell.row.original.beds.length.toString()}
                        type="number"
                        onBlur={(text) => updateRoomMutation.mutate({
                          ...cell.row.original,
                          // bedCount: parseInt(text) TODO use bedcount change
                        })} // TODO update to somthing better than blur
                        min={1}
                        id={cell.row.original.id + 'bedCount'}
                      />
                    </div>
                  ),
                  name: (
                    <div className={tw('flex flex-row items-center w-10/12 min-w-[50px]')}>
                      <Input
                        value={cell.row.original.name}
                        type="text"
                        onChange={text => cell.row.original.name}
                        onBlur={(event) => updateRoomMutation.mutate({
                          ...cell.row.original,
                          name: event.target.value
                        })} // TODO update to somthing better than blur
                        id={cell.row.original.name}
                        minLength={minRoomNameLength}
                        maxLength={maxRoomNameLength}
                      />
                    </div>
                  ),
                  remove: (
                    <div className={tw('flex flex-row justify-end')}>
                      <Button
                        onClick={() => setDeletionConfirmDialogState({
                          display: true,
                          single: cell
                        })}
                        color="negative"
                        variant="textButton"
                      >
                        {translation.remove}
                      </Button>
                    </div>
                  ),
                  select: (
                    <div className={tw('flex flex-row')}>
                      <Checkbox
                        checked={cell.row.getIsSelected()}
                        onChange={() => cell.row.toggleSelected()}
                      />
                    </div>
                  )
                }[cell.column.id]}
              </td>
            ))}
          </tr>
        ))}
        {table.getState().pagination.pageIndex === (table.getPageCount() - 1) && table.getPageCount() > 1
          && (usedRooms.length % roomsPerPage) !== 0
          && ([...Array((roomsPerPage - (usedRooms.length % roomsPerPage)) % roomsPerPage)].map((i, index) => (
            <tr key={index} className={tw('h-12')}>
              {[table.getAllColumns.length].map((j, index) => (
                <td key={index}/>
              ))}
            </tr>
          )))}
        </tbody>
      </table>
      <div className={tw('flex flex-row justify-center mt-2')}>
        <Pagination page={table.getState().pagination.pageIndex}
                    numberOfPages={Math.max(table.getPageCount(), 1)}
                    onPageChanged={table.setPageIndex}
        />
      </div>
    </div>
  )
}
