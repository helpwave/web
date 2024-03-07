import { useState } from 'react'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { defaultTableStatePagination, Table, type TableState } from '@helpwave/common/components/Table'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { InvitationState } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Avatar } from '@helpwave/common/components/Avatar'
import { useAuth } from '@/hooks/useAuth'
import {
  useInvitationsByUserQuery,
  useInviteAcceptMutation,
  useInviteDeclineMutation,
  type Invitation
} from '@/mutations/organization_mutations'
import { ReSignInModal } from '@/components/modals/ReSignInModal'

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
 * A table that shows all organizations a user hast been invited to
 */
export const UserInvitationList = ({
  language,
}: PropsWithLanguage<UserInvitationListProps>) => {
  const translation = useTranslation(language, defaultUserInvitationListTranslation)
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
        loadingProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
        errorProps={{ classname: tw('border-2 border-gray-500 rounded-xl min-h-[200px]') }}
      >
        {data && (
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
              <div key="name" className={tw('flex flex-row justify-start items-center gap-x-2')}>
                <Avatar avatarUrl={invite.organization.id} alt=""/>
                <Span>{invite.organization.longName}</Span>
              </div>,
              <Button
                key="accept"
                color="positive"
                onClick={() => acceptInvite(invite.id)}
              >
                {translation.accept}
              </Button>,
              <Button
                key="decline"
                color="negative"
                onClick={() => declineInviteMutation.mutate(invite.id)}
              >
                {translation.decline}
              </Button>
            ]}
          />
        )}
      </LoadingAndErrorComponent>
    </>
  )
}
