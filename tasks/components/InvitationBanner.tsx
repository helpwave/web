import { Mail } from 'lucide-react'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import Link from 'next/link'
import { useInvitationsByUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import { InvitationState } from '@helpwave/api-services/types/users/invitations'

type InvitationBannerTranslation = {
  openInvites: string,
}

const defaultInvitationBannerTranslation: Translation<InvitationBannerTranslation> = {
  en: {
    openInvites: 'Open invites'
  },
  de: {
    openInvites: 'Offene Einladungen'
  }
}

export type InvitationBannerProps = {
  invitationCount?: number,
}

/**
 * A Banner that only appears when the user has pending invitations
 */
export const InvitationBanner = ({
  overwriteTranslation,
  invitationCount
}: PropsForTranslation<InvitationBannerTranslation, InvitationBannerProps>) => {
  const translation = useTranslation(defaultInvitationBannerTranslation, overwriteTranslation)
  const { data, isError, isLoading } = useInvitationsByUserQuery(InvitationState.INVITATION_STATE_PENDING)
  let openInvites = invitationCount

  if (!invitationCount) {
    if (!data || isError || isLoading) {
      return null
    }
    if (data) {
      openInvites = data.length
    }
  }

  if (!openInvites || openInvites <= 0) {
    return null
  }

  return (
  <Link
    className="w-full bg-primary text-white py-2 px-4 rounded-xl cursor-pointer select-none row gap-x-2 items-center"
    href="/invitations"
  >
    <Mail />{`${translation.openInvites}: ${openInvites}`}
  </Link>
  )
}
