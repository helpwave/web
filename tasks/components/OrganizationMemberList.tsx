import { useContext, useState } from 'react'
import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import {
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table,
  type TableState
} from '@helpwave/common/components/Table'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Avatar } from '@helpwave/common/components/Avatar'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import { useRemoveMemberMutation } from '@helpwave/api-services/mutations/users/organization_mutations'
import { OrganizationContext } from '@/pages/organizations'

type OrganizationMemberListTranslation = {
  edit: string,
  remove: string,
  removeSelection: string,
  deselectAll: string,
  selectAll: string,
  members: string,
  member: string,
  saveChanges: string,
  role: string,
  dangerZoneText: (single: boolean) => string,
  deleteConfirmText: (single: boolean) => string,
}

const defaultOrganizationMemberListTranslations: Record<Languages, OrganizationMemberListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    removeSelection: 'Remove Selected',
    deselectAll: 'Deselect all',
    selectAll: 'Select all',
    members: 'Members',
    member: 'Member',
    saveChanges: 'Save changes',
    role: 'Role',
    dangerZoneText: (single) => `Deleting ${single ? `a ${defaultOrganizationMemberListTranslations.en.member}` : defaultOrganizationMemberListTranslations.en.members} is a permanent action and cannot be undone. Be careful!`,
    deleteConfirmText: (single) => `Do you really want to delete the selected ${single ? defaultOrganizationMemberListTranslations.en.member : defaultOrganizationMemberListTranslations.en.members}?`,
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    members: 'Mitgliedern',
    member: 'Mitglied',
    saveChanges: 'Speichern',
    role: 'Rolle',
    dangerZoneText: (single) => `Das Löschen ${single ? `eines ${defaultOrganizationMemberListTranslations.de.member}` : `von ${defaultOrganizationMemberListTranslations.de.member}`} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich ${single ? `das ausgewählte ${defaultOrganizationMemberListTranslations.de.member}` : `die ausgewählten ${defaultOrganizationMemberListTranslations.de.members}`}  löschen?`,
  }
}

type DeleteDialogState = { isShowing: boolean, member?: OrganizationMember }
const defaultDeleteDialogState: DeleteDialogState = { isShowing: false }

export type OrganizationMemberListProps = {
  organizationId?: string,
  members?: OrganizationMember[],
}

/**
 * A table for showing and editing the members of an organization
 */
export const OrganizationMemberList = ({
  overwriteTranslation,
  organizationId,
  members
}: PropsForTranslation<OrganizationMemberListTranslation, OrganizationMemberListProps>) => {
  const translation = useTranslation(defaultOrganizationMemberListTranslations, overwriteTranslation)
  const [tableState, setTableState] = useState<TableState>({ pagination: defaultTableStatePagination, selection: defaultTableStateSelection })

  const context = useContext(OrganizationContext)
  organizationId ??= context.state.organizationId
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationId)
  const membersByOrganization = data ?? []
  const usedMembers: OrganizationMember[] = members ?? membersByOrganization ?? []
  const removeMemberMutation = useRemoveMemberMutation(organizationId)

  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(defaultDeleteDialogState)

  const hasSelectedMultiple = !!tableState.selection && tableState.selection.currentSelection.length > 1
  const idMapping = (dataObject: OrganizationMember) => dataObject.id

  // TODO move this filtering to the Table component
  const admins: string[] = [] // usedMembers.filter(value => value.role === Role.admin).map(idMapping)
  if (tableState.selection?.currentSelection.find(value => admins.find(adminId => adminId === value))) {
    const newSelection = tableState.selection.currentSelection.filter(value => !admins.find(adminId => adminId === value))
    setTableState({
      ...tableState,
      selection: {
        currentSelection: newSelection,
        hasSelectedAll: false, // There is always one admin
        hasSelectedSome: newSelection.length > 0,
        hasSelectedNone: newSelection.length === 0,
      }
    })
  }

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        id="organizationMemberList-DeleteDialog"
        title={translation.deleteConfirmText(hasSelectedMultiple)}
        description={translation.dangerZoneText(hasSelectedMultiple)}
        isOpen={deleteDialogState.isShowing}
        onCancel={() => setDeleteDialogState(defaultDeleteDialogState)}
        onBackgroundClick={() => setDeleteDialogState(defaultDeleteDialogState)}
        onConfirm={() => {
          if (deleteDialogState.member) {
            setTableState(removeFromTableSelection(tableState, [deleteDialogState.member], usedMembers.length, idMapping))
            removeMemberMutation.mutate(deleteDialogState.member.id)
          } else {
            const selected = usedMembers.filter(value => tableState.selection?.currentSelection.includes(idMapping(value)))
            setTableState(removeFromTableSelection(tableState, selected, usedMembers.length, idMapping))
            selected.forEach(value => removeMemberMutation.mutate(value.id))
          }
          setDeleteDialogState(defaultDeleteDialogState)
        }}
        confirmType="negative"
      />
      <LoadingAndErrorComponent
        hasError={(isError || !data) && !members}
        isLoading={!members && isLoading}
        errorProps={{ classname: tw('border-2 border-gray-600 rounded-xl min-h-[300px]') }}
        loadingProps={{ classname: tw('border-2 border-gray-600 rounded-xl min-h-[300px]') }}
      >
        <div className={tw('flex flex-row justify-between items-center mb-2')}>
          <span className={tw('textstyle-table-name')}>{translation.members + ` (${usedMembers.length})`}</span>
          <div className={tw('flex flex-row gap-x-2')}>
            {tableState.selection && tableState.selection.currentSelection.length > 0 && (
              <SolidButton
                onClick={() => setDeleteDialogState({ isShowing: true })}
                color="hw-negative"
              >
                {translation.removeSelection}
              </SolidButton>
            )}
          </div>
        </div>
        <Table
          data={usedMembers}
          stateManagement={[tableState, setTableState]}
          header={[
            <div key="member" className={tw('flex flex-row')}>
              <span className={tw('textstyle-table-header')}>{translation.member}</span>
            </div>,
            <div key="role" className={tw('flex flex-row')}>
              <span className={tw('textstyle-table-header')}>{translation.role}</span>
            </div>,
            <></>
          ]}
          rowMappingToCells={orgMember => [
            <div key="member" className={tw('flex flex-row items-center h-12 overflow-hidden max-w-[200px]')}>
              <Avatar avatarUrl={orgMember.avatarURL} alt="" size="small"/>
              <div className={tw('flex flex-col ml-2')}>
                <span className={tw('font-bold truncate')}>{orgMember.name}</span>
                <a href={`mailto:${orgMember.email}`}>
                  <span className={tw('textstyle-description text-sm truncate')}>{orgMember.email}</span>
                </a>
              </div>
            </div>,
            <div key="role" className={tw('flex flex-row items-center mr-2')}>
              <button className={tw('flex flex-row items-center')} onClick={() => { /* TODO allow changing roles */
              }}>
                <span className={tw(`font-semibold`)}>
                  {'N.A.' /* translation.roleTypes[orgMember.role] */}
                </span>
              </button>
            </div>,
            <div key="remove" className={tw('flex flex-row justify-end')}>
              <SolidButton
                onClick={() => setDeleteDialogState({ isShowing: true, member: orgMember })}
                color="hw-negative"
                variant="text"
                // disabled={orgMember.role === Role.admin}
              >
                {translation.remove}
              </SolidButton>
            </div>
          ]}
         identifierMapping={idMapping}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
