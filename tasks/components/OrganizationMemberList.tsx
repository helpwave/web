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
import { Pagination } from '@helpwave/common/components/Pagination'
import { Button } from '@helpwave/common/components/Button'
import { Checkbox } from '@helpwave/common/components/user_input/Checkbox'
import { Avatar } from './Avatar'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { useState } from 'react'

// TODO replace later
export const enum Role {
  user,
  admin,
}

type OrganizationMemberListTranslation = {
  edit: string,
  remove: string,
  removeSelection: string,
  deselectAll: string,
  selectAll: string,
  members: string,
  member: string,
  addMember: string,
  saveChanges: string,
  role: string,
  roleTypes: Record<Role, string>,
  dangerZoneText: (single: boolean) => string,
  deleteConfirmText: (single: boolean) => string
}

const defaultOrganizationMemberListTranslations: Record<Languages, OrganizationMemberListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    removeSelection: 'Remove Selection',
    deselectAll: 'Deselect all',
    selectAll: 'Select all',
    members: 'Members',
    member: 'Member',
    addMember: 'Add member',
    saveChanges: 'Save changes',
    role: 'Role',
    roleTypes: { [Role.admin]: 'Admin', [Role.user]: 'User' },
    dangerZoneText: (single) => `Deleting ${single ? `a ${defaultOrganizationMemberListTranslations.en.member}` : defaultOrganizationMemberListTranslations.en.members} is a permanent action and cannot be undone. Be careful!`,
    deleteConfirmText: (single) => `Do you really want to delete the selected ${single ? defaultOrganizationMemberListTranslations.en.member : defaultOrganizationMemberListTranslations.en.members}?`,
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Auswahl entfernen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    members: 'Mitgliedern',
    member: 'Mitglied',
    addMember: 'Miglied hinzufügen',
    saveChanges: 'Speichern',
    role: 'Rolle',
    roleTypes: { [Role.admin]: 'Administrator', [Role.user]: 'Nutzer' },
    dangerZoneText: (single) => `Das Löschen ${single ? `eines ${defaultOrganizationMemberListTranslations.de.member}` : `von ${defaultOrganizationMemberListTranslations.de.member}`} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich ${single ? `das ausgewählte ${defaultOrganizationMemberListTranslations.de.member}` : `die ausgewählten ${defaultOrganizationMemberListTranslations.de.members}`}  löschen?`,
  }
}

type OrgMember = {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

export type OrganizationMemberListProps = {
  members: OrgMember[],
  usersPerPage?: number,
  onChange: (members: OrgMember[]) => void
}

const columnHelper = createColumnHelper<OrgMember>()

const columns = [
  columnHelper.display({
    id: 'select',
  }),
  columnHelper.accessor('name', {
    id: 'name',
  }),
  columnHelper.accessor('role', {
    id: 'role',
  }),
  columnHelper.display({
    id: 'remove',
  }),
]

export const OrganizationMemberList = ({
  language,
  usersPerPage = 5,
  members,
  onChange
}: PropsWithLanguage<OrganizationMemberListTranslation, OrganizationMemberListProps>) => {
  const translation = useTranslation(language, defaultOrganizationMemberListTranslations)

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: usersPerPage } }
  })

  const addUser = () => {
    // TODO remove below for an actual user add
    const newMember = {
      name: 'user' + (members.length + 1),
      role: Role.user,
      email: `user${(members.length + 1)}@helpwave.de`,
      isSelected: false,
      avatarURL: ''
    }
    onChange([...members, newMember])
  }

  type ConfirmDialogState = {
    display: boolean,
    single: CoreCell<OrgMember, unknown> | null
  }
  const defaultState: ConfirmDialogState = { display: false, single: null }
  const [stateDeletionConfirmDialog, setDeletionConfirmDialogState] = useState(defaultState)
  const resetDeletionConfirmDialogState = () => setDeletionConfirmDialogState(defaultState)

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
            onChange(members.filter(value => value !== stateDeletionConfirmDialog.single?.row.original))
          } else {
            table.toggleAllRowsSelected(false)
            onChange(members.filter(value => !table.getSelectedRowModel().rows.find(row => row.original === value)))
          }
          resetDeletionConfirmDialogState()
        }}
        confirmType="negative"
      />
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <span className={tw('font-bold font-space')}>{translation.members + ` (${members.length})`}</span>
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
          <Button onClick={addUser} color="positive">
            <div className={tw('flex flex-row items-center')}>
              <span className={tw('mr-2')}>{translation.addMember}</span>
            </div>
          </Button>
        </div>
      </div>
      <table>
        <thead className={tw('after:block after:h-1 border-b-2 after:w-full')}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : {
                      select: (
                      <Checkbox
                        checked={table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
                        onChange={() => table.toggleAllRowsSelected()}
                      />),
                      name: (
                      <div className={tw('flex flex-row pl-10')}>
                        <span>{translation.member}</span>
                      </div>),
                      role: (
                      <div className={tw('flex flex-row items-center pr-2')}>
                        {translation.role}
                      </div>),
                      remove: <div/>,
                    }[header.column.id]
                }
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody className={tw('before:h-2 before:block before:text-transparent')}>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {{
                  role: (
                    <div className={tw('flex flex-row items-center mr-2')}>
                      <button className={tw('flex flex-row items-center')} onClick={() => { /* TODO allow changing roles */
                      }}>
                        <span className={tw(`font-semibold`)}>
                          {translation.roleTypes[cell.row.original.role]}
                        </span>
                      </button>
                    </div>
                  ),
                  name: (
                    <div className={tw('flex flex-row items-center h-12')}>
                      <Avatar avatarUrl={cell.row.original.avatarURL} alt={cell.row.original.name} size="small"/>
                      <div className={tw('flex flex-col ml-2')}>
                        <span className={tw('font-bold h-5')}>{cell.row.original.name}</span>
                        <span className={tw('text-sm text-gray-400')}>{cell.row.original.email}</span>
                      </div>
                    </div>
                  ),
                  remove: (
                    <div className={tw('flex flex-row justify-end')}>
                      <button onClick={() => setDeletionConfirmDialogState({
                        display: true,
                        single: cell
                      })}>
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
          && (members.length % usersPerPage) !== 0
          && ([...Array((usersPerPage - (members.length % usersPerPage)) % usersPerPage)].map((i, index) => (
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
