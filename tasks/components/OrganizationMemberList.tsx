import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Avatar } from './Avatar'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import type { TableState } from '@helpwave/common/components/Table'
import {
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table
} from '@helpwave/common/components/Table'
import type { OrgMember } from '../mutations/organization_member_mutations'
import { Role, useMembersByOrganizationQuery } from '../mutations/organization_member_mutations'
import { InputModal } from '@helpwave/common/components/modals/InputModal'
import {
  useInviteMemberMutation,
  useRemoveMemberMutation
} from '../mutations/organization_mutations'
import { validateEmail } from '@helpwave/common/util/emailValidation'

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
  deleteConfirmText: (single: boolean) => string,
  addMemberDialogText: string,
  addAndNext: string,
  email: string
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
    addMember: 'Add member',
    saveChanges: 'Save changes',
    role: 'Role',
    roleTypes: { [Role.admin]: 'Admin', [Role.user]: 'User' },
    dangerZoneText: (single) => `Deleting ${single ? `a ${defaultOrganizationMemberListTranslations.en.member}` : defaultOrganizationMemberListTranslations.en.members} is a permanent action and cannot be undone. Be careful!`,
    deleteConfirmText: (single) => `Do you really want to delete the selected ${single ? defaultOrganizationMemberListTranslations.en.member : defaultOrganizationMemberListTranslations.en.members}?`,
    addMemberDialogText: 'Add a Member',
    addAndNext: 'Add and next',
    email: 'Email',
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
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
    addMemberDialogText: 'Mitglied hinzufügen',
    addAndNext: 'Hinzufügen und nächsten',
    email: 'Email',
  }
}

type DeleteDialogState = {isShowing: boolean, member?: OrgMember}
const defaultDeleteDialogState: DeleteDialogState = { isShowing: false }

export type OrganizationMemberListProps = {
  organizationID: string,
  members: OrgMember[],
  usersPerPage?: number,
  onChange: (members: OrgMember[]) => void
}

/**
 * A table for showing and editing the members of an organization
 */
export const OrganizationMemberList = ({
  language,
  organizationID
}: PropsWithLanguage<OrganizationMemberListTranslation, OrganizationMemberListProps>) => {
  const translation = useTranslation(language, defaultOrganizationMemberListTranslations)
  const [tableState, setTableState] = useState<TableState>({ pagination: defaultTableStatePagination, selection: defaultTableStateSelection })
  const [newMember, setNewMember] = useState<string>()
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationID)

  const removeMemberMutation = useRemoveMemberMutation(() => undefined, organizationID)
  const inviteMemberMutation = useInviteMemberMutation(() => undefined, organizationID)

  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(defaultDeleteDialogState)

  // TODO add view for loading
  if (isLoading) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  const hasSelectedMultiple = !!tableState.selection && tableState.selection.currentSelection.length > 1
  const idMapping = (dataObject: OrgMember) => dataObject.id
  const newMemberIsValid = !!newMember && validateEmail(newMember)

  return (
    <div className={tw('flex flex-col')}>
      <ConfirmDialog
        title={translation.deleteConfirmText(hasSelectedMultiple)}
        description={translation.dangerZoneText(hasSelectedMultiple)}
        isOpen={deleteDialogState.isShowing}
        onCancel={() => setDeleteDialogState(defaultDeleteDialogState)}
        onBackgroundClick={() => setDeleteDialogState(defaultDeleteDialogState)}
        onConfirm={() => {
          if (deleteDialogState.member) {
            setTableState(removeFromTableSelection(tableState, [deleteDialogState.member], data.length, idMapping))
            removeMemberMutation.mutate(deleteDialogState.member.id)
          } else {
            const selected = data.filter(value => tableState.selection?.currentSelection.includes(idMapping(value)))
            setTableState(removeFromTableSelection(tableState, selected, data.length, idMapping))
            selected.forEach(value => removeMemberMutation.mutate(value.id))
          }
          setDeleteDialogState(defaultDeleteDialogState)
        }}
        confirmType="negative"
      />
      <InputModal
        title={translation.addMemberDialogText}
        isOpen={!!newMember || newMember !== undefined}
        onCancel={() => setNewMember(undefined)}
        onBackgroundClick={() => setNewMember(undefined)}
        onConfirm={() => {
          if (newMemberIsValid) {
            inviteMemberMutation.mutate(newMember)
          }
          setNewMember(undefined)
        }}
        inputs={[{ value: newMember ?? '', type: 'email', onChange: text => setNewMember(text) }]}
        buttonOverwrites={[{}, { color: 'warn', disabled: newMemberIsValid }, { text: translation.addMember, disabled: newMemberIsValid }]}
      />
      <div className={tw('flex flex-row justify-between items-center mb-2')}>
        <Span type="tableName">{translation.members + ` (${data.length})`}</Span>
        <div className={tw('flex flex-row gap-x-2')}>
          {tableState.selection && tableState.selection.currentSelection.length > 0 && (
            <Button
              onClick={() => setDeleteDialogState({ isShowing: true })}
              color="negative"
            >
              {translation.removeSelection}
            </Button>
          )}
          <Button onClick={() => setNewMember('')} color="positive">
            <div className={tw('flex flex-row items-center')}>
              <Span className={tw('mr-2')}>{translation.addMember}</Span>
            </div>
          </Button>
        </div>
      </div>
      <Table
        data={data}
        stateManagement={[tableState, setTableState]}
        header={[
          <div key="member" className={tw('flex flex-row pl-10')}>
            <Span type="tableHeader">{translation.member}</Span>
          </div>,
          <div key="role" className={tw('flex flex-row')}>
            <Span type="tableHeader">{translation.role}</Span>
          </div>,
          <></>
        ]}
        rowMappingToCells={dataObject => [
          <div key="member" className={tw('flex flex-row items-center h-12')}>
            <Avatar avatarUrl={dataObject.avatarURL} alt={dataObject.name.charAt(0)}
                    size="small"/>
            <div className={tw('flex flex-col ml-2')}>
              <Span className={tw('font-bold h-5')}>{dataObject.name}</Span>
              <Span type="description" className={tw('text-sm')}>{dataObject.email}</Span>
            </div>
          </div>,
          <div key="role" className={tw('flex flex-row items-center mr-2')}>
            <button className={tw('flex flex-row items-center')} onClick={() => { /* TODO allow changing roles */
            }}>
              <Span className={tw(`font-semibold`)}>
                {translation.roleTypes[dataObject.role]}
              </Span>
            </button>
          </div>,
          <div key="remove" className={tw('flex flex-row justify-end')}>
            <Button
              onClick={() => setDeleteDialogState({ isShowing: true, member: dataObject })}
              color="negative"
              variant="textButton"
            >
              {translation.remove}
            </Button>
          </div>
        ]}
       identifierMapping={idMapping}
      />
    </div>
  )
}
