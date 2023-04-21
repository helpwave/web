import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ChevronDown } from 'lucide-react'
import { Pagination } from './Pagination'
import { Button } from './Button'
import { Input } from './user_input/Input'
import { Checkbox } from './user_input/Checkbox'

type RoomListTranslation = {
  edit: string,
  remove: string,
  deselectAll: string,
  selectAll: string,
  rooms: string,
  addRoom: string,
  bedCount: string
}

const defaultRoomListTranslations: Record<Languages, RoomListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    deselectAll: 'Deselect All',
    selectAll: 'Select All',
    rooms: 'Rooms',
    addRoom: 'Add Room',
    bedCount: 'Number of Beds'
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    rooms: 'Räume',
    addRoom: 'Raum hinzufügen',
    bedCount: 'Bettenanzahl'
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
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <span className={tw('font-bold font-space')}>{translation.rooms + ` (${rooms.length})`}</span>
        <Button onClick={addRoom} color="positive">
          <div className={tw('flex flex-row items-center')}>
            <span className={tw('mr-2')}>{translation.addRoom}</span>
            <ChevronDown/>
          </div>
        </Button>
      </div>
      <table>
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : {
                      select:
                      (<div className={tw('pr-4')}>
                          <Checkbox
                            checked={table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
                            onChange={() => table.toggleAllRowsSelected()}
                          />
                        </div>
                      ),
                      name:
                      (<div className={tw('flex flex-row')}>
                        <span>{table.getIsAllRowsSelected() ? translation.deselectAll : translation.selectAll}</span>
                      </div>),
                      bedCount:
                      (<div className={tw('flex flex-row')}>
                        {translation.bedCount}
                      </div>),
                      remove:
                      (<div className={tw('flex flex-row justify-end pl-8')}>
                        <button
                          onClick={() => {
                            table.toggleAllRowsSelected(false)
                            onChange(rooms.filter(value => !table.getSelectedRowModel().rows.find(row => row.original === value)))
                          }}>
                          <span>{translation.remove}</span>
                        </button>
                      </div>),
                    }[header.column.id]
                }
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody>
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
                      <button onClick={() => onChange(rooms.filter(value => value !== cell.row.original))}>
                        <span className={tw('text-hw-negative-500')}>{translation.remove}</span>
                      </button>
                    </div>
                  ),
                  select: (
                    <Checkbox
                      checked={cell.row.getIsSelected()}
                      onChange={() => cell.row.toggleSelected()}
                    />
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
