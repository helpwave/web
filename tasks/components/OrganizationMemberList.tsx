import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Avatar } from './Avatar'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { useContext, useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import type { TableState } from '@helpwave/common/components/Table'
import {
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table
} from '@helpwave/common/components/Table'
import type { OrgMember } from '../mutations/organization_member_mutations'
import { Role } from '../mutations/organization_member_mutations'
import { useOrganizationsForUserQuery, useRemoveMemberMutation } from '../mutations/organization_mutations'
import { OrganizationContext } from '../pages/organizations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

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
  roleTypes: Record<Role, string>,
  dangerZoneText: (single: boolean) => string,
  deleteConfirmText: (single: boolean) => string
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
    roleTypes: { [Role.admin]: 'Admin', [Role.user]: 'User' },
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
    roleTypes: { [Role.admin]: 'Administrator', [Role.user]: 'Nutzer' },
    dangerZoneText: (single) => `Das Löschen ${single ? `eines ${defaultOrganizationMemberListTranslations.de.member}` : `von ${defaultOrganizationMemberListTranslations.de.member}`} ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!`,
    deleteConfirmText: (single) => `Wollen Sie wirklich ${single ? `das ausgewählte ${defaultOrganizationMemberListTranslations.de.member}` : `die ausgewählten ${defaultOrganizationMemberListTranslations.de.members}`}  löschen?`,
  }
}

type DeleteDialogState = {isShowing: boolean, member?: OrgMember}
const defaultDeleteDialogState: DeleteDialogState = { isShowing: false }

export type OrganizationMemberListProps = {
  organizationId?: string,
  members?: OrgMember[]
}

/**
 * A table for showing and editing the members of an organization
 */
export const OrganizationMemberList = ({
  language,
  organizationId,
  members
}: PropsWithLanguage<OrganizationMemberListTranslation, OrganizationMemberListProps>) => {
  const translation = useTranslation(language, defaultOrganizationMemberListTranslations)
  const [tableState, setTableState] = useState<TableState>({ pagination: defaultTableStatePagination, selection: defaultTableStateSelection })

  const context = useContext(OrganizationContext)
  organizationId ??= context.state.organizationId
  // const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationId) TODO use later
  const { data, isError, isLoading } = useOrganizationsForUserQuery()
  const membersByOrganization = data?.find(value => value.id === organizationId)?.members ?? []
  const usedMembers: OrgMember[] = members ?? membersByOrganization ?? []
  const removeMemberMutation = useRemoveMemberMutation(organizationId)

  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(defaultDeleteDialogState)

  const hasSelectedMultiple = !!tableState.selection && tableState.selection.currentSelection.length > 1
  const idMapping = (dataObject: OrgMember) => dataObject.id

  // TODO move this filtering to the Table component
  const admins = usedMembers.filter(value => value.role === Role.admin).map(idMapping)
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
          <Span type="tableName">{translation.members + ` (${usedMembers.length})`}</Span>
          <div className={tw('flex flex-row gap-x-2')}>
            {tableState.selection && tableState.selection.currentSelection.length > 0 && (
              <Button
                onClick={() => setDeleteDialogState({ isShowing: true })}
                color="negative"
              >
                {translation.removeSelection}
              </Button>
            )}
          </div>
        </div>
        <Table
          data={usedMembers}
          stateManagement={[tableState, setTableState]}
          header={[
            <div key="member" className={tw('flex flex-row')}>
              <Span type="tableHeader">{translation.member}</Span>
            </div>,
            <div key="role" className={tw('flex flex-row')}>
              <Span type="tableHeader">{translation.role}</Span>
            </div>,
            <></>
          ]}
          rowMappingToCells={orgMember => [
            <div key="member" className={tw('flex flex-row items-center h-12 overflow-hidden max-w-[200px]')}>
              <Avatar avatarUrl={orgMember.avatarURL} alt="" size="small"/>
              <div className={tw('flex flex-col ml-2')}>
                <Span className={tw('font-bold truncate')}>{orgMember.name}</Span>
                <a href={`mailto:${orgMember.email}`}>
                  <Span type="description" className={tw('text-sm truncate')}>{orgMember.email}</Span>
                </a>
              </div>
            </div>,
            <div key="role" className={tw('flex flex-row items-center mr-2')}>
              <button className={tw('flex flex-row items-center')} onClick={() => { /* TODO allow changing roles */
              }}>
                <Span className={tw(`font-semibold`)}>
                  {translation.roleTypes[orgMember.role]}
                </Span>
              </button>
            </div>,
            <div key="remove" className={tw('flex flex-row justify-end')}>
              <Button
                onClick={() => setDeleteDialogState({ isShowing: true, member: orgMember })}
                color="negative"
                variant="textButton"
                disabled={orgMember.role === Role.admin}
              >
                {translation.remove}
              </Button>
            </div>
          ]}
         identifierMapping={idMapping}
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
