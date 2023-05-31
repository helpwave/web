import type { NextPage } from 'next'
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
import { organizations } from '../mutations/organization_mutations'
import { wards } from '../mutations/ward_mutations'

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

const Dashboard: NextPage = ({ language }: PropsWithLanguage<DashboardTranslation>) => {
  const translation = useTranslation(language, defaultDashboardTranslations)
  const { user } = useAuth()

  if (!user) return null

  return (
    <PageWithHeader
      crumbs={[{ display: translation.dashboard, link: '/' }]}
    >
      <Head>
        <title>{titleWrapper()}</title>
      </Head>
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
          width < 50 ? <div/> : (
            <FeatureDetails
              features={[
                {
                  title: 'Feature 1',
                  date: new Date('2023-04-22T14:09:58+00:00'),
                  description: [
                    new URL('https://images.unsplash.com/photo-1606327054536-e37e655d4f4a?ixlib=rb-4.0.3&ixid=MnwxM[…]90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'),
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod no sea takimata sanctus est Lorem ipsum dolor sit amet.'
                  ]
                },
                {
                  title: 'Feature 2',
                  date: new Date('2022-12-31T14:09:58+00:00'),
                  externalResource: new URL('https://helpwave.de'),
                  description: [
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod no sea takimata sanctus est Lorem ipsum dolor sit amet.'
                  ]
                },
                {
                  title: 'Feature 3',
                  date: new Date('2021-01-22T14:09:58+00:00'),
                  description: [
                    new URL('https://images.unsplash.com/photo-1606327054536-e37e655d4f4a?ixlib=rb-4.0.3&ixid=MnwxM[…]90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'),
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod no sea takimata sanctus est Lorem ipsum dolor sit amet.'
                  ]
                }
              ]}
            />
          )
        )}
      />
    </PageWithHeader>
  )
}

export default Dashboard
