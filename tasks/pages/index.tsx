import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../hooks/useAuth'
import { PageWithHeader } from '../components/layout/PageWithHeader'
import titleWrapper from '../utils/titleWrapper'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../components/layout/TwoColumn'
import { FeatureDetails } from '../components/layout/FeatureDetails'
import { DashboardDisplay } from '../components/layout/DashboardDisplay'
import { useWardOverviewsQuery } from '../mutations/ward_mutations'
import { useOrganizationsByUserQuery } from '../mutations/organization_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { tw } from '@twind/core'
import { featuresSchema, fetchFeatures } from '../utils/features'

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
  const json = await fetchFeatures()
  return { props: { jsonFeed: json } }
}

const Dashboard: NextPage<PropsWithLanguage<DashboardTranslation, DashboardServerSideProps>> = ({ jsonFeed, language }) => {
  const translation = useTranslation(language, defaultDashboardTranslations)
  const { user } = useAuth()
  const { data: wards, isLoading: isLoadingWards } = useWardOverviewsQuery()
  const { data: organizations, isLoading: isLoadingOrganizations } = useOrganizationsByUserQuery()

  return (
    <PageWithHeader
      crumbs={[{ display: translation.dashboard, link: '/' }]}
    >
      <Head>
        <title>{titleWrapper()}</title>
      </Head>
      <LoadingAndErrorComponent
        isLoading={isLoadingWards || isLoadingOrganizations || !user || !wards || !organizations}
        loadingProps={{ classname: tw('!h-full') }}
      >
        {organizations && wards && (
          <TwoColumn
            disableResize={false}
            left={width => ((
                <DashboardDisplay
                  organizations={organizations}
                  wards={wards}
                  width={width}
                />
            )
            )}
            right={width => (
              <FeatureDetails
                width={width}
                features={featuresSchema.parse(jsonFeed)}
              />
            )}
          />
        )}
      </LoadingAndErrorComponent>
    </PageWithHeader>
  )
}

export default Dashboard
