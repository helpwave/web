import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page';
import titleWrapper from '@/utils/titleWrapper';

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

const Dashboard: NextPage<PropsForTranslation<DashboardTranslation, DashboardServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultDashboardTranslations, overwriteTranslation)
  return (
    <Page pageTitle={titleWrapper('Dashboard')}>
      <div>This is the {translation.dashboard} page</div>
    </Page>
  )
}

export default Dashboard
