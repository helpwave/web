import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { withOrganization } from '@/hooks/useOrganization'
import { withAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'

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
  const router = useRouter()

  useEffect(() => {
   router.push('/products').catch(console.error)
  }, [router])

  return (
    <Page pageTitle={titleWrapper(translation.dashboard)} mainContainerClassName="h-full">
      <div className="col h-full items-center justify-center">
        {<LoadingAnimation/>}
      </div>
    </Page>
  )
}

export default withAuth(withOrganization(Dashboard))
