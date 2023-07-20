import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { TableState } from '@helpwave/common/components/Table'
import { defaultTableStatePagination, Table } from '@helpwave/common/components/Table'
import { useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'

type OrganisationInvitationListTranslation = {
  remove: string,
  email: string,
  invitations: string
}

const defaultOrganisationInvitationListTranslation: Record<Languages, OrganisationInvitationListTranslation> = {
  en: {
    remove: 'Remove',
    email: 'Email',
    invitations: 'invitations'
  },
  de: {
    remove: 'Entfernen',
    email: 'Email',
    invitations: 'Einladungen'
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
  const [tableState, setTableState] = useState<TableState>({ pagination: { ...defaultTableStatePagination, entriesPerPage: 10 } })

  const usedInvitations: OrganisationInvitation[] = invitations ?? []

  const idMapping = (invite: OrganisationInvitation) => invite.email

  return (
    <div>
      <Span type="tableName">{`${translation.invitations} (${usedInvitations.length})`}</Span>
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
          <Button
            key="remove"
            color="negative"
            onClick={() => onChange(usedInvitations.filter(value => idMapping(value) !== idMapping(invite)))}
          >
            {translation.remove}
          </Button>
        ]}
      />
    </div>
  )
}
