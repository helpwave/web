import { createContext, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '../../components/layout/TwoColumn'
import { WardDisplay } from '../../components/layout/WardDisplay'
import { WardDetail } from '../../components/layout/WardDetails'
import { PageWithHeader } from '../../components/layout/PageWithHeader'
import titleWrapper from '../../utils/titleWrapper'

type WardsPageTranslation = {
  wards: string,
  organizations: string
}

const defaultWardsPageTranslation = {
  en: {
    wards: 'Wards',
    organizations: 'Organization'
  },
  de: {
    wards: 'Stationen',
    organizations: 'Organisation'
  }
}

export type OrganizationOverviewContextState = {
  /**
   wardID === "" means creating a new ward
   */
  wardID: string,
  organizationID: string
}

const emptyOrganizationOverviewContextState = {
  organizationID: '',
  wardID: ''
}

export type OrganizationOverviewContextType = {
  state: OrganizationOverviewContextState,
  updateContext: (context: OrganizationOverviewContextState) => void
}

export const OrganizationOverviewContext = createContext<OrganizationOverviewContextType>({
  state: emptyOrganizationOverviewContextState,
  updateContext: () => undefined
})

/**
 * The page for displaying and editing the wards within an organization
 */
const WardsPage: NextPage = ({ language }: PropsWithLanguage<WardsPageTranslation>) => {
  const translation = useTranslation(language, defaultWardsPageTranslation)
  const [contextState, setContextState] = useState<OrganizationOverviewContextState>(emptyOrganizationOverviewContextState)
  const [usedQueryParam, setUsedQueryParam] = useState(false)

  const router = useRouter()
  const { uuid, wardID } = router.query
  const organizationID = uuid as string

  if (wardID && !usedQueryParam) {
    setContextState({
      ...emptyOrganizationOverviewContextState,
      wardID: wardID as string,
      organizationID
    })
    setUsedQueryParam(true)
  }

  return (
    <PageWithHeader
      crumbs={[
        { display: translation.organizations, link: `/organizations?organizationID=${organizationID}` },
        { display: translation.wards, link: `/organizations/${organizationID}` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wards)}</title>
      </Head>
      <OrganizationOverviewContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={width => (<WardDisplay width={width}/>)}
          right={width => (
            <WardDetail
              key={contextState.wardID}
              width={width}
            />
          )}
        />
      </OrganizationOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardsPage
