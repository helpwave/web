import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Invitation } from '../mutations/organization_mutations'
import { useInvitationsByUserQuery } from '../mutations/organization_mutations'
import type { TableState } from '@helpwave/common/components/Table'
import { defaultTableStatePagination, Table } from '@helpwave/common/components/Table'
import { useState } from 'react'
import { Avatar } from './Avatar'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'

type UserInvitationListTranslation = {
  accept: string,
  decline: string,
  organization: string
}

const defaultUserInvitationListTranslation: Record<Languages, UserInvitationListTranslation> = {
  en: {
    accept: 'Accept',
    decline: 'Decline',
    organization: 'Organization'
  },
  de: {
    accept: 'Annehmen',
    decline: 'Ablehnen',
    organization: 'Organisation'
  }
}

export type UserInvitationListProps = Record<string, never>

/**
 * Description
 */
export const UserInvitationList = ({
  language,
}: PropsWithLanguage<UserInvitationListTranslation, UserInvitationListProps>) => {
  const translation = useTranslation(language, defaultUserInvitationListTranslation)
  const [tableState, setTableState] = useState<TableState>({ pagination: { ...defaultTableStatePagination, entriesPerPage: 10 } })
  const { data, isLoading, isError } = useInvitationsByUserQuery()

  const idMapping = (invite: Invitation) => invite.id

  // TODO add view for loading
  if (isLoading || !data) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError) {
    return <div>Error Message</div>
  }

  return (
    <div>
      <Table
        data={data}
        stateManagement={[tableState, setTableState]}
        identifierMapping={idMapping}
        header={[
          <Span key="organization" type="tableHeader">{translation.organization}</Span>,
          <></>,
          <></>
        ]}
        rowMappingToCells={invite => [
          <div key="name" className={tw('flex flex-row justify-start gap-x-2')}>
            <Avatar avatarUrl={invite.organization.id} alt=""/>
            <Span>{invite.organization.longName}</Span>
          </div>,
          <Button key="accept" color="positive">{translation.accept}</Button>,
          <Button key="decline" color="negative">{translation.decline}</Button>
        ]}
      />
    </div>
  )
}
