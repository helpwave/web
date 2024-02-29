import { useContext, useState } from 'react'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { defaultTableStatePagination, Table, type TableState } from '@helpwave/common/components/Table'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { InputModal } from '@helpwave/common/components/modals/InputModal'
import { validateEmail } from '@helpwave/common/util/emailValidation'
import { InvitationState } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import {
  useInvitationsByOrganizationQuery,
  useInviteMemberMutation, useInviteRevokeMutation
} from '@/mutations/organization_mutations'
import { OrganizationContext } from '@/pages/organizations'

type OrganizationInvitationListTranslation = {
  remove: string,
  email: string,
  addAndNext: string,
  add: string,
  invitations: string,
  inviteMember: string
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
  email: string
}

export type OrganizationInvitationListProps = {
  organizationId: string,
  invitations?: OrganizationInvitation[],
  onChange: (invites: OrganizationInvitation[]) => void
}

/**
 * A List showing all members invited to an organization
 */
export const OrganizationInvitationList = ({
  language,
  organizationId,
  invitations,
  onChange
}: PropsWithLanguage<OrganizationInvitationListTranslation, OrganizationInvitationListProps>) => {
  const translation = useTranslation(language, defaultOrganizationInvitationListTranslation)

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
      errorProps={{ classname: tw('border-2 border-gray-500 rounded-xl') }}
      loadingProps={{ classname: tw('border-2 border-gray-500 rounded-xl') }}
    >
      <InputModal
        id="inviteMemberModal"
        modalClassName={tw('min-w-[400px]')}
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
          { disabled: !isValidEmail, color: 'accent', text: translation.add }
        ]}
      />
      <div className={tw('flex flex-row justify-between')}>
        <Span type="tableName">{`${translation.invitations} (${usedInvitations.length})`}</Span>
        <Button
          color="positive"
          onClick={() => setInviteMemberModalEmail('')}
        >
          {translation.inviteMember}
        </Button>
      </div>
      <Table
        data={usedInvitations}
        stateManagement={[tableState, setTableState]}
        identifierMapping={idMapping}
        header={[
          <Span key="organization" type="tableHeader">{translation.email}</Span>,
          <></>
        ]}
        rowMappingToCells={invite => [
          <div key="email" className={tw('flex flex-row justify-start gap-x-2')}>
            <Span>{invite.email}</Span>
          </div>,
          <div key="remove" className={tw('flex flex-row justify-end')}>
            <Button
              color="negative"
              variant="textButton"
              onClick={() => {
                if (!isCreatingOrganization) {
                  revokeInviteMutation.mutate(invite.id)
                }
                onChange(usedInvitations.filter(value => idMapping(value) !== idMapping(invite)))
              }}
            >
              {translation.remove}
            </Button>
          </div>
        ]}
      />
    </LoadingAndErrorComponent>
  )
}
