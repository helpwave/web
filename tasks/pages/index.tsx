import { useEffect, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import type {
  Languages,
  LocalizedNews,
  PropsForTranslation
} from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  localizedNewsSchema,
  useLocalStorage,
  useTranslation
} from '@helpwave/hightide'
import { useOrganizationsForUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { NewsFeed } from '@/components/layout/NewsFeed'
import { DashboardDisplay } from '@/components/layout/DashboardDisplay'
import titleWrapper from '@/utils/titleWrapper'
import { fetchLocalizedNews } from '@/utils/news'
import { getConfig } from '@/utils/config'
import { StagingDisclaimerModal } from '@/components/modals/StagingDisclaimerModal'

const config = getConfig()

type DashboardTranslation = {
  dashboard: string,
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
  jsonFeed: unknown,
}

export const getServerSideProps: GetServerSideProps<DashboardServerSideProps> = async () => {
  const json = await fetchLocalizedNews()
  return { props: { jsonFeed: json } }
}

const Dashboard: NextPage<PropsForTranslation<DashboardTranslation, DashboardServerSideProps>> = ({
                                                                                                    jsonFeed,
                                                                                                    overwriteTranslation
                                                                                                  }) => {
  const translation = useTranslation(defaultDashboardTranslations, overwriteTranslation)
  const { user } = useAuth()
  const { data: organizations, isLoading, isError } = useOrganizationsForUserQuery()

  console.log(isLoading, isError)

  const [isStagingDisclaimerOpen, setStagingDisclaimerOpen] = useState(false)
  const [lastTimeStagingDisclaimerDismissed, setLastTimeStagingDisclaimerDismissed] = useLocalStorage('staging-disclaimer-dismissed-time', 0)

  const dismissStagingDisclaimer = () => {
    setLastTimeStagingDisclaimerDismissed(new Date().getTime())
    setStagingDisclaimerOpen(false)
  }

  useEffect(() => {
    const ONE_DAY = 1000 * 60 * 60 * 24
    if (config.showStagingDisclaimerModal && new Date().getTime() - lastTimeStagingDisclaimerDismissed > ONE_DAY) {
      setStagingDisclaimerOpen(true)
    }
  }, [lastTimeStagingDisclaimerDismissed])

  return (
    <PageWithHeader
      crumbs={[{ display: translation.dashboard, link: '/' }]}
    >
      <Head>
        <title>{titleWrapper()}</title>
      </Head>

      <StagingDisclaimerModal
        id="main-staging-disclaimer-modal"
        onConfirm={dismissStagingDisclaimer}
        isOpen={isStagingDisclaimerOpen}
      />

      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
        loadingProps={{ classname: '!h-full' }}
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
