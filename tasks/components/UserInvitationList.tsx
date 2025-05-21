import { useState } from 'react'

import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { defaultTableStatePagination, Table, type TableState } from '@helpwave/hightide'
import { SolidButton } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { Avatar } from '@helpwave/hightide'
import {
  useInvitationsByUserQuery,
  useInviteAcceptMutation,
  useInviteDeclineMutation
} from '@helpwave/api-services/mutations/users/organization_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { Invitation } from '@helpwave/api-services/types/users/invitations'
import { InvitationState } from '@helpwave/api-services/types/users/invitations'
import { ReSignInModal } from '@/components/modals/ReSignInModal'

type UserInvitationListTranslation = {
  accept: string,
  decline: string,
  organization: string,
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
 * A table that shows all organizations a user hast been invited to
 */
export const UserInvitationList = ({
  overwriteTranslation,
}: PropsForTranslation<UserInvitationListTranslation, UserInvitationListProps>) => {
  const translation = useTranslation(defaultUserInvitationListTranslation, overwriteTranslation)
  const [tableState, setTableState] = useState<TableState>({ pagination: { ...defaultTableStatePagination, entriesPerPage: 10 } })
  const { data, isLoading, isError } = useInvitationsByUserQuery(InvitationState.INVITATION_STATE_PENDING)
  const [isShowingReSignInDialog, setIsShowingReSignInDialog] = useState(false)
  const { signOut } = useAuth()

  const declineInviteMutation = useInviteDeclineMutation()
  const acceptInviteMutation = useInviteAcceptMutation()

  const acceptInvite = (inviteId: string) => acceptInviteMutation.mutateAsync(inviteId)
    .then(() => setIsShowingReSignInDialog(true))

  const idMapping = (invite: Invitation) => invite.id

  return (
    <>
      <ReSignInModal
        id="OrganizationDetail-ReSignInModal"
        isOpen={isShowingReSignInDialog}
        onConfirm={() => {
          setIsShowingReSignInDialog(false)
          signOut()
        }}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading || !data}
        hasError={isError}
        loadingProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
        errorProps={{ classname: 'border-2 border-gray-500 rounded-xl min-h-[200px]' }}
      >
        {data && (
          <Table
            data={data}
            stateManagement={[tableState, setTableState]}
            identifierMapping={idMapping}
            header={[
              <span key="organization" className="textstyle-table-header">{translation.organization}</span>,
              <></>,
              <></>
            ]}
            rowMappingToCells={invite => [
              <div key="name" className="row justify-start items-center gap-x-2">
                <Avatar avatarUrl={invite.organization.id} alt=""/>
                <span>{invite.organization.longName}</span>
              </div>,
              <SolidButton
                key="accept"
                color="positive"
                onClick={() => acceptInvite(invite.id)}
              >
                {translation.accept}
              </SolidButton>,
              <SolidButton
                key="decline"
                color="negative"
                onClick={() => declineInviteMutation.mutate(invite.id)}
              >
                {translation.decline}
              </SolidButton>
            ]}
          />
        )}
      </LoadingAndErrorComponent>
    </>
  )
}
