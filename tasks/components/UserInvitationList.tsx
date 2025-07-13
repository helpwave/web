import { useCallback, useMemo, useState } from 'react'
import type { Translation } from '@helpwave/hightide'
import {
  Avatar,
  FillerRowElement,
  LoadingAndErrorComponent,
  type PropsForTranslation,
  SolidButton,
  Table,
  useTranslation
} from '@helpwave/hightide'
import {
  useInvitationsByUserQuery,
  useInviteAcceptMutation,
  useInviteDeclineMutation
} from '@helpwave/api-services/mutations/users/organization_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { Invitation } from '@helpwave/api-services/types/users/invitations'
import { InvitationState } from '@helpwave/api-services/types/users/invitations'
import { ReSignInDialog } from '@/components/modals/ReSignInDialog'
import type { ColumnDef } from '@tanstack/react-table'

type UserInvitationListTranslation = {
  accept: string,
  decline: string,
  organization: string,
}

const defaultUserInvitationListTranslation: Translation<UserInvitationListTranslation> = {
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
  const translation = useTranslation([defaultUserInvitationListTranslation], overwriteTranslation)
  const { data, isLoading, isError } = useInvitationsByUserQuery(InvitationState.INVITATION_STATE_PENDING)
  const [isShowingReSignInDialog, setIsShowingReSignInDialog] = useState(false)
  const { signOut } = useAuth()

  const declineInviteMutation = useInviteDeclineMutation()
  const acceptInviteMutation = useInviteAcceptMutation()

  const acceptInvite = useCallback((inviteId: string) => {
    acceptInviteMutation.mutateAsync(inviteId)
      .then(() => setIsShowingReSignInDialog(true))
  }, [acceptInviteMutation])

  const columns = useMemo<ColumnDef<Invitation>[]>(() => [
    {
      id: 'organization',
      header: translation('organization'),
      cell: ({ cell }) => {
        if (!data) {
          return
        }
        const invite = data[cell.row.index]!
        return (
          <div key="name" className="row justify-start items-center gap-x-2 h-8">
            <Avatar avatarUrl={invite.organization.id} alt="" size="small"/>
            <span>{invite.organization.longName}</span>
          </div>
        )
      },
      accessorFn: (invite) => invite.organization.longName,
      sortingFn: 'text',
      minSize: 200,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        if (!data) {
          return
        }
        const invite = data[cell.row.index]!
        return (
          <div className="row gap-x-4 items-center justify-end">
            <SolidButton
              key="accept"
              color="positive"
              onClick={() => acceptInvite(invite.id)}
            >
              {translation('accept')}
            </SolidButton>
            <SolidButton
              key="decline"
              color="negative"
              onClick={() => declineInviteMutation.mutate(invite.id)}
            >
              {translation('decline')}
            </SolidButton>
          </div>
        )
      },
      minSize: 240,
    },
  ], [acceptInvite, data, declineInviteMutation, translation])

  return (
    <>
      <ReSignInDialog
        isOpen={isShowingReSignInDialog}
        onConfirm={() => {
          setIsShowingReSignInDialog(false)
          signOut()
        }}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading || !data}
        hasError={isError}
        className="min-h-157"
        minimumLoadingDuration={200}
      >
        {data && (
          <Table
            data={data}
            columns={columns}
            initialState={{ pagination: { pageSize: 10 } }}
            fillerRow={(columnId) => {
              if (columnId === 'actions') {
                return (<div/>)
              }
              return (<FillerRowElement className="h-8"/>)
            }}
          />
        )}
      </LoadingAndErrorComponent>
    </>
  )
}
