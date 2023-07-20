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
  useInviteDeclineMutation,
  useInviteMemberMutation
} from '../mutations/organization_mutations'
import { validateEmail } from '@helpwave/common/util/emailValidation'

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
    invitations: 'invitations',
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
  organizationID: string, // TODO use to fetch open invites in an organization
  invitations?: OrganisationInvitation[],
  onChange: (invites: OrganisationInvitation[]) => void
}

/**
 * Description
 */
export const OrganisationInvitationList = ({
  language,
  invitations,
  onChange
}: PropsWithLanguage<OrganisationInvitationListTranslation, OrganisationInvitationListProps>) => {
  const translation = useTranslation(language, defaultOrganisationInvitationListTranslation)

  const context = useContext(OrganizationContext)
  const [tableState, setTableState] = useState<TableState>({
    pagination: {
      ...defaultTableStatePagination,
      entriesPerPage: 10
    }
  })
  const [inviteMemberModalEmail, setInviteMemberModalEmail] = useState<string>()

  const isCreatingOrganization = context.state.organizationID === ''
  const usedInvitations: OrganisationInvitation[] = invitations ?? [] // TODO get Invitations by organization
  const inviteMemberMutation = useInviteMemberMutation(context.state.organizationID)
  const declineInviteMutation = useInviteDeclineMutation()
  const idMapping = (invite: OrganisationInvitation) => invite.email
  const isValidEmail = !!inviteMemberModalEmail && validateEmail(inviteMemberModalEmail)
  const isShowingInviteMemberModal = inviteMemberModalEmail !== undefined

  return (
    <div>
      {isShowingInviteMemberModal && (
        <InputModal
          modalClassName={tw('min-w-[400px]')}
          isOpen={isShowingInviteMemberModal}
          onBackgroundClick={() => setInviteMemberModalEmail(undefined)}
          onConfirm={() => {
            if (!isCreatingOrganization) {
              inviteMemberMutation.mutate(inviteMemberModalEmail)
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
          // Overwrite button
          onDecline={() => {
            if (!isCreatingOrganization) {
              inviteMemberMutation.mutate(inviteMemberModalEmail)
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
