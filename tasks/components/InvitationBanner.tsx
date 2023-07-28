import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useInvitationsByUserQuery } from '../mutations/organization_mutations'
import { InvitationState } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { tw } from '@helpwave/common/twind'
import { Mail } from 'lucide-react'

type InvitationBannerTranslation = {
  openInvites: string
}

const defaultInvitationBannerTranslation: Record<Languages, InvitationBannerTranslation> = {
  en: {
    openInvites: 'Open invites'
  },
  de: {
    openInvites: 'Offene Einladungen'
  }
}

export type InvitationBannerProps = {
  invitationCount?: number
}

/**
 * A Banner that only appears when the user has pending invitations
 */
export const InvitationBanner = ({
  language,
  invitationCount
}: PropsWithLanguage<InvitationBannerTranslation, InvitationBannerProps>) => {
  const translation = useTranslation(language, defaultInvitationBannerTranslation)
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
  <a
    className={tw('w-full bg-hw-primary-400 text-white py-2 px-4 rounded-xl cursor-pointer select-none flex flex-row gap-x-2 items-center')}
    href="/invitations"
  >
    <Mail />{`${translation.openInvites}: ${openInvites}`}
  </a>
  )
}
