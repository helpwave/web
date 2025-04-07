import Head from 'next/head'
import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { UserInvitationList } from '@/components/UserInvitationList'
import titleWrapper from '@/utils/titleWrapper'

type InvitationsPageTranslation = {
  invitations: string,
}

const defaultInvitationsPageTranslation: Record<Languages, InvitationsPageTranslation> = {
  en: {
    invitations: 'Invitations'
  },
  de: {
    invitations: 'Einladungen'
  }
}

export type InvitationsPageProps = Record<string, never>

/**
 * Page for Invitations
 */
export const InvitationsPage = ({
  overwriteTranslation,
}: PropsForTranslation<InvitationsPageTranslation, InvitationsPageProps>) => {
  const translation = useTranslation(defaultInvitationsPageTranslation, overwriteTranslation)
  return (
    <PageWithHeader
      crumbs={[{ display: translation.invitations, link: '/invitations' }]}
    >
      <Head>
        <title>{titleWrapper(translation.invitations)}</title>
      </Head>
      <div className={tw('flex flex-col items-center')}>
          <div className={tw('w-1/2')}>
            <UserInvitationList/>
          </div>
      </div>
    </PageWithHeader>
  )
}

export default InvitationsPage
