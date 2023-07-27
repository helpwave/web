import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { TableState } from '@helpwave/common/components/Table'
import { defaultTableStatePagination, Table } from '@helpwave/common/components/Table'
import { useContext, useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { InputModal } from '@helpwave/common/components/modals/InputModal'
import { OrganizationContext } from '../pages/organizations'
import {
  useInvitationsByOrganisationQuery,
  useInviteDeclineMutation,
  useInviteMemberMutation
} from '../mutations/organization_mutations'
import { validateEmail } from '@helpwave/common/util/emailValidation'
import { InvitationState } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'

type OrganisationInvitationListTranslation = {
  remove: string,
  email: string,
  addAndNext: string,
  add: string,
  invitations: string,
  inviteMember: string
}

const defaultOrganisationInvitationListTranslation: Record<Languages, OrganisationInvitationListTranslation> = {
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

export type OrganisationInvitation = {
  id: string,
  email: string
}

export type OrganisationInvitationListProps = {
  organizationID: string,
  invitations?: OrganisationInvitation[],
  onChange: (invites: OrganisationInvitation[]) => void
}

/**
 * Description
 */
export const OrganisationInvitationList = ({
  language,
  organizationID,
  invitations,
  onChange
}: PropsWithLanguage<OrganisationInvitationListTranslation, OrganisationInvitationListProps>) => {
  const translation = useTranslation(language, defaultOrganisationInvitationListTranslation)

  const context = useContext(OrganizationContext)
  const usedOrganizationID = organizationID ?? context.state.organizationID
  const isCreatingOrganization = usedOrganizationID === ''
  const { data, isLoading, isError } = useInvitationsByOrganisationQuery(context.state.organizationID)
  const [tableState, setTableState] = useState<TableState>({
    pagination: {
      ...defaultTableStatePagination,
      entriesPerPage: 10
    }
  })
  const [inviteMemberModalEmail, setInviteMemberModalEmail] = useState<string>()
  // Maybe move this filter to the endpoint or the query
  const usedInvitations: OrganisationInvitation[] = invitations ?? (data ?? []).filter(value => value.state === InvitationState.INVITATION_STATE_PENDING)

  const inviteMemberMutation = useInviteMemberMutation(usedOrganizationID)
  const declineInviteMutation = useInviteDeclineMutation()
  const idMapping = (invite: OrganisationInvitation) => invite.email
  const isValidEmail = !!inviteMemberModalEmail && validateEmail(inviteMemberModalEmail)
  const isShowingInviteMemberModal = inviteMemberModalEmail !== undefined

  // TODO add view for loading
  if (isLoading && context.state.organizationID) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError && context.state.organizationID) {
    return <div>Error Message</div>
  }

  return (
    <div>
      {isShowingInviteMemberModal && (
        <InputModal
          modalClassName={tw('min-w-[400px]')}
          isOpen={isShowingInviteMemberModal}
          onBackgroundClick={() => setInviteMemberModalEmail(undefined)}
          onConfirm={() => {
            if (!isCreatingOrganization) {
              inviteMemberMutation.mutate({ email: inviteMemberModalEmail })
            }
            onChange([...usedInvitations, {
              id: '',
              email: inviteMemberModalEmail
            }])
            setInviteMemberModalEmail(undefined)
          }} inputs={[{
            label: translation.email,
            value: inviteMemberModalEmail,
            onChange: text => setInviteMemberModalEmail(text)
          }]}
          // Overwritten button doesn't do anything regarding decline
          onDecline={() => {
            if (!isCreatingOrganization) {
              inviteMemberMutation.mutate({ email: inviteMemberModalEmail })
            }
            onChange([...usedInvitations, {
              id: '',
              email: inviteMemberModalEmail
            }])
            setInviteMemberModalEmail('')
          }}
          buttonOverwrites={[
            {},
            { disabled: !isValidEmail, color: 'positive', text: translation.addAndNext },
            { disabled: !isValidEmail, color: 'accent', text: translation.add }
          ]}
        />
      )}
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
                  declineInviteMutation.mutate(invite.id)
                }
                onChange(usedInvitations.filter(value => idMapping(value) !== idMapping(invite)))
              }}
            >
              {translation.remove}
            </Button>
          </div>
        ]}
      />
    </div>
  )
}
