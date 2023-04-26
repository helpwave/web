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
import { useState } from 'react'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Pagination } from '@helpwave/common/components/Pagination'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Checkbox } from '@helpwave/common/components/user_input/Checkbox'

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
    removeSelection: 'Remove Selection',
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
    removeSelection: 'Auswahl entfernen',
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

type Room = {
  bedCount: number,
  name: string
}

export type RoomListProps = {
  rooms: Room[],
  roomsPerPage?: number,
  onChange: (rooms: Room[]) => void
}

const columnHelper = createColumnHelper<Room>()

const columns = [
  columnHelper.display({
    id: 'select',
  }),
  columnHelper.accessor('name', {
    id: 'name',
  }),
  columnHelper.accessor('bedCount', {
    id: 'bedCount',
  }),
  columnHelper.display({
    id: 'remove',
  }),
]

export const RoomList = ({
  language,
  roomsPerPage = 5,
  rooms,
  onChange
}: PropsWithLanguage<RoomListTranslation, RoomListProps>) => {
  const translation = useTranslation(language, defaultRoomListTranslations)

  type ConfirmDialogState = {
    display: boolean,
    single: CoreCell<Room, unknown> | null
  }
  const defaultState: ConfirmDialogState = { display: false, single: null }
  const [stateDeletionConfirmDialog, setDeletionConfirmDialogState] = useState(defaultState)
  const resetDeletionConfirmDialogState = () => setDeletionConfirmDialogState(defaultState)

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: roomsPerPage } }
  })

  const addRoom = () => {
    const defaultBedCount = 3
    // TODO remove below for an actual room add
    const newRoom = {
      name: 'room' + (rooms.length + 1),
      bedCount: defaultBedCount,
      isSelected: false
    }
    onChange([...rooms, newRoom])
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
            onChange(rooms.filter(value => value !== stateDeletionConfirmDialog.single?.row.original))
          } else {
            table.toggleAllRowsSelected(false)
            onChange(rooms.filter(value => !table.getSelectedRowModel().rows.find(row => row.original === value)))
          }
          resetDeletionConfirmDialogState()
        }}
        confirmType="negative"
      />
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <span className={tw('font-bold font-space')}>{translation.rooms + ` (${rooms.length})`}</span>
        <div className={tw('flex flex-row gap-x-2')}>
          {table.getIsSomePageRowsSelected() && (
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
                        <span>{translation.roomName}</span>
                      </div>),
                      bedCount:
                      (<div className={tw('flex flex-row')}>
                        {translation.bedCount}
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
                        value={cell.row.original.bedCount.toString()}
                        type="number"
                        onChange={(text) => onChange(rooms.map(value => value.name === cell.row.original.name ? {
                          ...cell.row.original,
                          bedCount: parseInt(text)
                        } : value))}
                        min={1}
                        id={cell.row.original.bedCount.toString()}
                      />
                    </div>
                  ),
                  name: (
                    <div className={tw('flex flex-row items-center w-10/12 min-w-[50px]')}>
                      <Input
                        value={cell.row.original.name}
                        type="text"
                        onChange={(text) => onChange(rooms.map(value => value.name === cell.row.original.name ? {
                          ...cell.row.original,
                          name: text
                        } : value))}
                        id={cell.row.original.name}
                      />
                    </div>
                  ),
                  remove: (
                    <div className={tw('flex flex-row justify-end')}>
                      <button
                        onClick={() => setDeletionConfirmDialogState({
                          display: true,
                          single: cell
                        })}
                      >
                        <span className={tw('text-hw-negative-500')}>{translation.remove}</span>
                      </button>
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
          && (rooms.length % roomsPerPage) !== 0
          && ([...Array((roomsPerPage - (rooms.length % roomsPerPage)) % roomsPerPage)].map((i, index) => (
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
