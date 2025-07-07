import Head from 'next/head'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { UserInvitationList } from '@/components/UserInvitationList'
import titleWrapper from '@/utils/titleWrapper'
import { ColumnTitle } from '@/components/ColumnTitle'

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
      <div className="col w-full py-4 px-6">
        <ColumnTitle title={translation('invitations')}></ColumnTitle>
        <UserInvitationList/>
      </div>
    </PageWithHeader>
  )
}

export default InvitationsPage
