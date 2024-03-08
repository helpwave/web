import { createContext, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { OrganizationDisplay } from '@/components/layout/OrganizationDisplay'
import { OrganizationDetail } from '@/components/layout/OrganizationDetails'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { useRouteParameters } from '@/hooks/useRouteParameters'

type OrganizationsPageTranslation = {
  organizations: string
}

const defaultOrganizationsPageTranslation = {
  de: {
    organizations: 'Organisationen'
  },
  en: {
    organizations: 'Organizations'
  }
}

export type OrganizationContextState = {
  organizationId: string
}

export const emptyOrganizationContextState: OrganizationContextState = {
  organizationId: ''
}

export type OrganizationContextType = {
  state: OrganizationContextState,
  updateContext: (context: OrganizationContextState) => void
}

export const OrganizationContext = createContext<OrganizationContextType>({
  state: emptyOrganizationContextState,
  updateContext: () => undefined
})

/**
 * The page for showing all organizations a user is part of
 */
const OrganizationsPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<OrganizationsPageTranslation>) => {
  const translation = useTranslation(defaultOrganizationsPageTranslation, overwriteTranslation)
  const organizationId = useRouteParameters<never, 'organizationId'>().organizationId
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const [context, setContext] = useState<OrganizationContextState>(emptyOrganizationContextState)

  if (organizationId && !usedQueryParam && organizationId) {
    setContext({
      ...context,
      organizationId: organizationId as string
    })
    setUsedQueryParam(true)
  }

  return (
    <PageWithHeader
      crumbs={[{
        display: translation.organizations,
        link: '/organizations'
      }]}
    >
      <Head>
        <title>{titleWrapper(translation.organizations)}</title>
      </Head>
      <OrganizationContext.Provider value={{ state: context, updateContext: setContext }}>
        <TwoColumn
          disableResize={false}
          left={width => (
            <OrganizationDisplay width={width} />
          )}
          right={width => (
            <OrganizationDetail
              key={context.organizationId}
              width={width}
            />
          )}
        />
      </OrganizationContext.Provider>
    </PageWithHeader>
  )
}

export default OrganizationsPage
