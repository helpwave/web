import { createContext, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { useRouteParameters } from '@/hooks/useRouteParameters'
import { PropertyDetails } from '@/components/layout/property/PropertyDetails'
import { PropertyDisplay } from '@/components/layout/property/PropertyDisplay'

type OrganizationsPageTranslation = {
  properties: string
}

const defaultOrganizationsPageTranslation = {
  en: {
    properties: 'Properties'
  },
  de: {
    properties: 'Eigenschaften'
  }
}

export type PropertiesContextState = {
  propertyId?: string
}

export const emptyPropertiesContextState: PropertiesContextState = {
  propertyId: undefined
}

export type PropertiesContextType = {
  state: PropertiesContextState,
  updateContext: (context: PropertiesContextState) => void
}

export const PropertyContext = createContext<PropertiesContextType>({
  state: emptyPropertiesContextState,
  updateContext: () => undefined
})

/**
 * The page for showing all properties and to create new ones
 */
const PropertiesPage: NextPage = ({ language }: PropsWithLanguage<OrganizationsPageTranslation>) => {
  const translation = useTranslation(language, defaultOrganizationsPageTranslation)
  const propertyId = useRouteParameters<never, 'id'>().id
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const [context, setContext] = useState<PropertiesContextState>(emptyPropertiesContextState)

  if (propertyId && !usedQueryParam) {
    setContext({
      ...context,
      propertyId: propertyId as string
    })
    setUsedQueryParam(true)
  }

  return (
    <PageWithHeader
      crumbs={[{
        display: translation.properties,
        link: '/properties'
      }]}
    >
      <Head>
        <title>{titleWrapper(translation.properties)}</title>
      </Head>
      <PropertyContext.Provider value={{ state: context, updateContext: setContext }}>
        <TwoColumn
          disableResize={false}
          left={() => (
            <PropertyDisplay /> // TODO property list
          )}
          right={() => (
            <PropertyDetails
              key={context.propertyId}
            />
          )}
        />
      </PropertyContext.Provider>
    </PageWithHeader>
  )
}

export default PropertiesPage
