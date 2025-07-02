import Head from 'next/head'
import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { UserInvitationList } from '@/components/UserInvitationList'
import titleWrapper from '@/utils/titleWrapper'

type InvitationsPageTranslation = {
  invitations: string,
}

const defaultInvitationsPageTranslation: Translation<InvitationsPageTranslation> = {
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
  const translation = useTranslation([defaultInvitationsPageTranslation], overwriteTranslation)
  return (
    <PageWithHeader
      crumbs={[{ display: translation('invitations'), link: '/invitations' }]}
    >
      <Head>
        <title>{titleWrapper(translation('invitations'))}</title>
      </Head>
      <div className="col items-center">
          <div className="w-1/2">
            <UserInvitationList/>
          </div>
      </div>
    </PageWithHeader>
  )
}

export default InvitationsPage
