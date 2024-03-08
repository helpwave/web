import { createContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { WardDisplay } from '@/components/layout/WardDisplay'
import { WardDetail } from '@/components/layout/WardDetails'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { useOrganizationQuery } from '@/mutations/organization_mutations'
import { useRouteParameters } from '@/hooks/useRouteParameters'

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
   wardId === "" means creating a new ward
   */
  wardId: string,
  organizationId: string
}

const emptyOrganizationOverviewContextState = {
  organizationId: '',
  wardId: ''
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
const WardsPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<WardsPageTranslation>) => {
  const translation = useTranslation(defaultWardsPageTranslation, overwriteTranslation)
  const [contextState, setContextState] = useState<OrganizationOverviewContextState>(emptyOrganizationOverviewContextState)
  const [usedQueryParam, setUsedQueryParam] = useState(false)

  const { organizationId, wardId } = useRouteParameters<'organizationId', 'wardId'>()
  const { data: organization } = useOrganizationQuery(organizationId)

  if (wardId && !usedQueryParam) {
    setContextState({
      ...emptyOrganizationOverviewContextState,
      wardId,
      organizationId
    })
    setUsedQueryParam(true)
  }

  useEffect(() => {
    setContextState(contextState => ({ ...contextState, organizationId }))
  }, [organizationId])

  return (
    <PageWithHeader
      crumbs={[
        { display: organization?.shortName ?? translation.organizations, link: `/organizations?organizationId=${organizationId}` },
        { display: translation.wards, link: `/organizations/${organizationId}` }
      ]}
    >
      <Head>
        <title>{titleWrapper(translation.wards)}</title>
      </Head>
      <OrganizationOverviewContext.Provider value={{ state: contextState, updateContext: setContextState }}>
        <TwoColumn
          disableResize={false}
          left={width => (<WardDisplay organizationId={organizationId} width={width} />)}
          right={width => (
            <WardDetail
              key={contextState.wardId}
              organizationId={organizationId}
              width={width}
            />
          )}
        />
      </OrganizationOverviewContext.Provider>
    </PageWithHeader>
  )
}

export default WardsPage
