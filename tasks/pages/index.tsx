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
import { useWardOverviewsQuery } from '../mutations/ward_mutations'
import { useOrganizationsByUserQuery } from '../mutations/organization_mutations'

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
  const { data: wards, isLoading: isLoadingWards } = useWardOverviewsQuery()
  const { data: organizations, isLoading: isLoadingOrganizations } = useOrganizationsByUserQuery()

  if (isLoadingWards || isLoadingOrganizations || !user || !wards || !organizations) return null

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
            <FeatureDetails
              width={width}
              features={[
                {
                  title: 'mission - Was ist helpwave?',
                  date: new Date('10 July 2023'),
                  externalResource: new URL('https://podcasters.spotify.com/pod/show/helpwave/episodes/mission---Was-ist-helpwave-e26n9gi/a-aa3paqd'),
                  description: [
                    new URL('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'),
                    'Hallo, willkommen zur allerersten richtigen Folge von helpwave talks! Heute wird es konkret: Was ist eigentlich helpwave? Was ist die Vision? Und vor allem wer ist helpwave und wie genau will helpwave mittels Informatik das Gesundheitswesen revolutionieren? Max Schäfer und Christian Porschen haben die Antworten und geben einen detaillieren Einblick in das "Was", "Wie" und vor allem "Warum" von helpwave.'
                  ]
                },

                {
                  title: 'trailer - Fusionsküche Medizin und Informatik',
                  date: new Date('30 June 2023'),
                  externalResource: new URL('https://podcasters.spotify.com/pod/show/helpwave/episodes/trailer---Fusionskche-Medizin-und-Informatik-e26dbf7/a-aa2rb9o'),
                  description: [
                    new URL('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80'),
                    'Hey! Willkommen bei helpwave talks unserem einzigartigen Format rund um die medizinische Informatik mit vielen interessanten Gästen aus Forschung, Entwicklung, Pflege, Recht, ...'
                  ]
                },
              ]}
            />
        )}
      />
    </PageWithHeader>
  )
}

export default Dashboard
