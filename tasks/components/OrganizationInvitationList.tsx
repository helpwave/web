import { useContext, useState } from 'react'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { defaultTableStatePagination, Table, type TableState } from '@helpwave/common/components/Table'
import { SolidButton, TextButton } from '@helpwave/common/components/Button'
import { InputModal } from '@helpwave/common/components/modals/InputModal'
import { validateEmail } from '@helpwave/common/util/emailValidation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import {
  useInvitationsByOrganizationQuery,
  useInviteMemberMutation, useInviteRevokeMutation
} from '@helpwave/api-services/mutations/users/organization_mutations'
import { InvitationState } from '@helpwave/api-services/types/users/invitations'
import { OrganizationContext } from '@/pages/organizations'

type OrganizationInvitationListTranslation = {
  remove: string,
  email: string,
  addAndNext: string,
  add: string,
  invitations: string,
  inviteMember: string,
}

const defaultOrganizationInvitationListTranslation: Record<Languages, OrganizationInvitationListTranslation> = {
  en: {
    remove: 'Remove',
    email: 'Email',
    addAndNext: 'Add and next',
    add: 'Add',
    invitations: 'Invitations',
    inviteMember: 'Invite Member'
  },
  de: {
    remove: 'Entfernen',
    email: 'Email',
    addAndNext: 'Hinzufügen und Nächster',
    add: 'Hinzufügen',
    invitations: 'Einladungen',
    inviteMember: 'Mitglied einladen'
  }
}

export type OrganizationInvitation = {
  id: string,
  email: string,
}

export type OrganizationInvitationListProps = {
  organizationId: string,
  invitations?: OrganizationInvitation[],
  onChange: (invites: OrganizationInvitation[]) => void,
}

/**
 * A List showing all members invited to an organization
 */
export const OrganizationInvitationList = ({
  overwriteTranslation,
  organizationId,
  invitations,
  onChange
}: PropsForTranslation<OrganizationInvitationListTranslation, OrganizationInvitationListProps>) => {
  const translation = useTranslation(defaultOrganizationInvitationListTranslation, overwriteTranslation)

  const context = useContext(OrganizationContext)
  const usedOrganizationId = organizationId ?? context.state.organizationId
  const isCreatingOrganization = usedOrganizationId === ''
  const { data, isLoading, isError } = useInvitationsByOrganizationQuery(context.state.organizationId)
  const [tableState, setTableState] = useState<TableState>({
    pagination: {
      ...defaultTableStatePagination,
      entriesPerPage: 10
    }
  })
  const [inviteMemberModalEmail, setInviteMemberModalEmail] = useState<string>()
  // Maybe move this filter to the endpoint or the query
  const usedInvitations: OrganizationInvitation[] = invitations ?? (data ?? []).filter(value => value.state === InvitationState.INVITATION_STATE_PENDING)

  const inviteMemberMutation = useInviteMemberMutation(usedOrganizationId)
  const revokeInviteMutation = useInviteRevokeMutation()
  const idMapping = (invite: OrganizationInvitation) => invite.email
  const isValidEmail = !!inviteMemberModalEmail && validateEmail(inviteMemberModalEmail)
  const isShowingInviteMemberModal = inviteMemberModalEmail !== undefined

  return (
    <LoadingAndErrorComponent
      isLoading={isLoading && !!context.state.organizationId}
      hasError={isError && !!context.state.organizationId}
      errorProps={{ classname: clsx('border-2 border-gray-500 rounded-xl') }}
      loadingProps={{ classname: clsx('border-2 border-gray-500 rounded-xl') }}
    >
      <InputModal
        id="inviteMemberModal"
        modalClassName={clsx('min-w-[400px]')}
        isOpen={isShowingInviteMemberModal}
        onBackgroundClick={() => setInviteMemberModalEmail(undefined)}
        onConfirm={() => {
          if (!isShowingInviteMemberModal) {
            return
          }
          if (!isCreatingOrganization) {
            inviteMemberMutation.mutate({ email: inviteMemberModalEmail })
          }
          onChange([...usedInvitations, {
            id: '',
            email: inviteMemberModalEmail
          }])
          setInviteMemberModalEmail(undefined)
        }}
        // Overwritten button doesn't do anything regarding decline
        onDecline={() => {
          if (!isShowingInviteMemberModal) {
            return
          }
          if (!isCreatingOrganization) {
            inviteMemberMutation.mutate({ email: inviteMemberModalEmail })
          }
          onChange([...usedInvitations, {
            id: '',
            email: inviteMemberModalEmail
          }])
          setInviteMemberModalEmail('')
        }}
        inputs={[{
          label: { name: translation.email },
          value: inviteMemberModalEmail ?? '',
          onChange: text => setInviteMemberModalEmail(text)
        }]}
        buttonOverwrites={[
          {},
          { disabled: !isValidEmail, color: 'positive', text: translation.addAndNext },
          { disabled: !isValidEmail, color: 'primary', text: translation.add }
        ]}
      />
      <div className={clsx('row justify-between')}>
        <span className={clsx('textstyle-table-name')}>{`${translation.invitations} (${usedInvitations.length})`}</span>
        <SolidButton
          color="positive"
          onClick={() => setInviteMemberModalEmail('')}
        >
          {translation.inviteMember}
        </SolidButton>
      </div>
      <Table
        data={usedInvitations}
        stateManagement={[tableState, setTableState]}
        identifierMapping={idMapping}
        header={[
          <span key="organization" className={clsx('textstyle-table-header')}>{translation.email}</span>,
          <></>
        ]}
        rowMappingToCells={invite => [
          <div key="email" className={clsx('row justify-start gap-x-2')}>
            <span>{invite.email}</span>
          </div>,
          <div key="remove" className={clsx('row justify-end')}>
            <TextButton
              color="negative"
              onClick={() => {
                if (!isCreatingOrganization) {
                  revokeInviteMutation.mutate(invite.id)
                }
                onChange(usedInvitations.filter(value => idMapping(value) !== idMapping(invite)))
              }}
            >
              {translation.remove}
            </TextButton>
          </div>
        ]}
      />
    </LoadingAndErrorComponent>
  )
}
