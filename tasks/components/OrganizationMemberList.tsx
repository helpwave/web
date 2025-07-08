import { useContext, useMemo, useState } from 'react'
import type { Translation, TranslationPlural } from '@helpwave/hightide'
import {
  Avatar,
  ConfirmModal,
  FillerRowElement,
  LoadingAndErrorComponent,
  type PropsForTranslation,
  SolidButton,
  TableWithSelection,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import type { OrganizationMember } from '@helpwave/api-services/types/users/organization_member'
import { useMembersByOrganizationQuery } from '@helpwave/api-services/mutations/users/organization_member_mutations'
import { useRemoveMemberMutation } from '@helpwave/api-services/mutations/users/organization_mutations'
import { OrganizationContext } from '@/pages/organizations'
import { ColumnTitle } from '@/components/ColumnTitle'
import { Trash } from 'lucide-react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import type { OrganizationInvitation } from '@/components/OrganizationInvitationList'

type OrganizationMemberListTranslation = {
  edit: string,
  remove: string,
  removeSelection: string,
  deselectAll: string,
  selectAll: string,
  member: TranslationPlural,
  saveChanges: string,
  role: string,
  dangerZoneText: TranslationPlural,
  deleteConfirmText: TranslationPlural,
}

const defaultOrganizationMemberListTranslations: Translation<OrganizationMemberListTranslation> = {
  en: {
    edit: 'Edit',
    remove: 'Remove',
    removeSelection: 'Remove Selected',
    deselectAll: 'Deselect all',
    selectAll: 'Select all',
    member: {
      one: 'Member',
      other: 'Members'
    },
    saveChanges: 'Save changes',
    role: 'Role',
    dangerZoneText: {
      one: 'Removing a member is a permanent action and cannot be undone. Be careful!',
      other: 'Removing members is a permanent action and cannot be undone. Be careful!'
    },
    deleteConfirmText: {
      one: 'Do you really want to remove the selected member?',
      other: 'Do you really want to remove the selected members?',
    },
  },
  de: {
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    removeSelection: 'Ausgewählte löschen',
    deselectAll: 'Auswahl aufheben',
    selectAll: 'Alle auswählen',
    member: {
      one: 'Mitglied',
      other: 'Mitglieder'
    },
    saveChanges: 'Speichern',
    role: 'Rolle',
    dangerZoneText: {
      one: 'Das Entfernen eines Mitglieds ist a permanent permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
      other: 'Das Entfernen von Mitgliedern ist a permanent permanent und kann nicht rückgängig gemacht werden. Vorsicht!'
    },
    deleteConfirmText: {
      one: 'Wollen Sie wirklich das ausgewählte Mitglied löschen?',
      other: 'Wollen Sie wirklich die ausgewählten Mitglieder löschen?',
    },
  }
}


type DeleteDialogState = {
  isShowing: boolean,
  /** If not set, the entire selection will be deleted */
  member?: OrganizationMember,
}
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
  const translation = useTranslation([defaultOrganizationMemberListTranslations], overwriteTranslation)

  const context = useContext(OrganizationContext)
  organizationId ??= context.state.organizationId
  const { data, isLoading, isError } = useMembersByOrganizationQuery(organizationId)
  const membersByOrganization = useMemo(() => data ?? [], [data])
  const usedMembers: OrganizationMember[] = useMemo(
    () => members ?? membersByOrganization ?? [], [members, membersByOrganization]
  )

  const removeMemberMutation = useRemoveMemberMutation(organizationId)
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(defaultDeleteDialogState)
  const [selectionState, setSelectionState] = useState<RowSelectionState>({})
  const columns = useMemo<ColumnDef<OrganizationInvitation>[]>(() => [
    {
      id: 'member',
      header: translation('member'),
      cell: ({ cell }) => {
        const orgMember = usedMembers[cell.row.index]!
        return (
          <TextButton
            className="row gap-x-2 items-center h-14 max-h-auto max-w-[200px] cursor-copy"
            onClick={event => {
              event.stopPropagation()
              navigator.clipboard.writeText(orgMember.email).catch(console.error)
            }}
          >
            <Avatar avatarUrl={orgMember.avatarURL} alt="" size="small"/>
            <div className="col items-start gap-y-0">
              <span className="font-bold truncate">{orgMember.name}</span>
              <span className="textstyle-description text-sm truncate">{orgMember.email}</span>
            </div>
          </TextButton>
        )
      },
      accessorKey: 'name',
      sortingFn: 'text',
      minSize: 200,
      meta: {
        filterType: 'text'
      }
    },
    /*
    {
      id: 'role',
      header: translation("role"),
      accessorFn: ({}) => {

      },
      minSize: 200,
      maxSize: 200,
      enableResizing: false,
    },
    */
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        const orgMember = usedMembers[cell.row.index]!
        return (
          <TextButton
            onClick={() => setDeleteDialogState({ isShowing: true, member: orgMember })}
            color="negative"
            // disabled={orgMember.role === Role.admin}
          >
            {translation('remove')}
          </TextButton>
        )
      },
      minSize: 200,
      maxSize: 200,
      enableResizing: false,
    }
  ], [translation, usedMembers])

  const selectedElements = Object.keys(selectionState ?? {}).length

  return (
    <div className="col">
      <ConfirmModal
        headerProps={{
          titleText: translation('deleteConfirmText', { count: selectedElements }),
          descriptionText: translation('dangerZoneText', { count: selectedElements }),
        }}
        isOpen={deleteDialogState.isShowing}
        onCancel={() => setDeleteDialogState(defaultDeleteDialogState)}
        onConfirm={() => {
          if (deleteDialogState.member) {
            if (selectionState[deleteDialogState.member.id]) {
              const newSelection = { ...selectionState }
              delete newSelection[deleteDialogState.member.id]
              setSelectionState(newSelection)
            }
            removeMemberMutation.mutate(deleteDialogState.member.id)
          } else {
            Object.keys(selectionState).forEach(value => {
              const member = usedMembers.find(member => member.id === value)
              if (member) {
                removeMemberMutation.mutate(member.id)
              }
            })
            setSelectionState({})
          }
          setDeleteDialogState(defaultDeleteDialogState)
        }}
        confirmType="negative"
      />
      <LoadingAndErrorComponent
        hasError={(isError || !data) && !members}
        isLoading={!members && isLoading}
        errorProps={{ classname: 'border-2 border-gray-600 rounded-xl min-h-[300px]' }}
        loadingProps={{ classname: 'border-2 border-gray-600 rounded-xl min-h-[300px]' }}
      >
        <ColumnTitle
          title={translation('member', { count: 2 /* Always use plural */ }) + ` (${usedMembers.length})`}
          actions={selectedElements > 0 && (
            <SolidButton
              onClick={() => setDeleteDialogState({ isShowing: true })}
              color="negative"
              size="small"
              startIcon={<Trash size={18}/>}
            >
              {translation('removeSelection')}
            </SolidButton>
          )}
          type="subtitle"
        />
        <TableWithSelection
          data={usedMembers}
          columns={columns}
          rowSelection={selectionState}
          onRowSelectionChange={setSelectionState}
          initialState={{
            pagination: {
              pageSize: 5,
            }
          }}
          fillerRow={(columnId) =>
            (<FillerRowElement key={columnId} className="h-14"/>)
          }
        />
      </LoadingAndErrorComponent>
    </div>
  )
}
