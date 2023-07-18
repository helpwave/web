import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import titleWrapper from '../utils/titleWrapper'
import Head from 'next/head'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import { InvitationList } from '../components/InvitationList'

type InvitationsPageTranslation = {
  invitations: string
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
  language,
}: PropsWithLanguage<InvitationsPageTranslation, InvitationsPageProps>) => {
  const translation = useTranslation(language, defaultInvitationsPageTranslation)
  return (
    <PageWithHeader
      crumbs={[{ display: translation.invitations, link: '/invitations' }]}
    >
      <Head>
        <title>{titleWrapper(translation.invitations)}</title>
      </Head>
      <div className={tw('flex flex-col')}>
        <InvitationList/>
      </div>
    </PageWithHeader>
  )
}

export default InvitationsPage
