import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tw } from '@twind/core'
import { localizedNewsSchema, type LocalizedNews } from '@helpwave/common/util/news'
import { useAuth } from '../hooks/useAuth'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'
import { TwoColumn } from '../components/layout/TwoColumn'
import { NewsFeed } from '../components/layout/NewsFeed'
import { DashboardDisplay } from '../components/layout/DashboardDisplay'
import { useOrganizationsForUserQuery } from '../mutations/organization_mutations'
import { fetchLocalizedNews } from '../utils/news'

type DashboardTranslation = {
  dashboard: string
}

const defaultDashboardTranslations: Record<Languages, DashboardTranslation> = {
  en: {
    dashboard: 'Dashboard'
  },
  de: {
    dashboard: 'Dashboard'
  }
}

type DashboardServerSideProps = {
  jsonFeed: unknown
}

export const getServerSideProps: GetServerSideProps<DashboardServerSideProps> = async () => {
  const json = await fetchLocalizedNews()
  return { props: { jsonFeed: json } }
}

const Dashboard: NextPage<PropsWithLanguage<DashboardTranslation, DashboardServerSideProps>> = ({ jsonFeed, language }) => {
  const translation = useTranslation(language, defaultDashboardTranslations)
  const { user } = useAuth()
  const { data: organizations, isLoading } = useOrganizationsForUserQuery()

  return (
    <PageWithHeader
      crumbs={[{ display: translation.dashboard, link: '/' }]}
    >
      <Head>
        <title>{titleWrapper()}</title>
      </Head>
      <LoadingAndErrorComponent
        isLoading={isLoading || !user || !organizations}
        loadingProps={{ classname: tw('!h-full') }}
      >
        {organizations && (
          <TwoColumn
            disableResize={false}
            left={width => ((
                <DashboardDisplay
                  width={width}
                />
            )
            )}
            right={width => (
              <NewsFeed
                width={width}
                // TODO fix typing
                localizedNews={localizedNewsSchema.parse(jsonFeed) as LocalizedNews}
              />
            )}
          />
        )}
      </LoadingAndErrorComponent>
    </PageWithHeader>
  )
}

export default Dashboard
