// import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useInvitationsByUserQuery } from '../mutations/organization_mutations'

type InvitationListTranslation = {
  accept: string,
  decline: string
}

const defaultInvitationListTranslation: Record<Languages, InvitationListTranslation> = {
  en: {
    accept: 'Accept',
    decline: 'Decline',
  },
  de: {
    accept: 'Annehmen',
    decline: 'Ablehnen',
  }
}

export type InvitationListProps = Record<string, never>

/**
 * Description
 */
export const InvitationList = ({
  language,
}: PropsWithLanguage<InvitationListTranslation, InvitationListProps>) => {
  const translation = useTranslation(language, defaultInvitationListTranslation)
  const { data } = useInvitationsByUserQuery()
  if (data && translation) {
    return null
  }
  return (
    <div>

    </div>
  )
}
