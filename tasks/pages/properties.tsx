import { createContext, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { TwoColumn } from '@/components/layout/TwoColumn'
import { PageWithHeader } from '@/components/layout/PageWithHeader'
import titleWrapper from '@/utils/titleWrapper'
import { useRouteParameters } from '@/hooks/useRouteParameters'
import { PropertyDetails } from '@/components/layout/property/PropertyDetails'
import { PropertyDisplay } from '@/components/layout/property/PropertyDisplay'
import type { SubjectType } from '@/components/layout/property/property'
import { subjectTypeList } from '@/components/layout/property/property'

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
  propertyId?: string,
  subjectType?: SubjectType
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
const PropertiesPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<OrganizationsPageTranslation>) => {
  const translation = useTranslation(defaultOrganizationsPageTranslation, overwriteTranslation)
  const { id: propertyId, subject: subjectType } = useRouteParameters<never, 'id' | 'subject'>()
  const [usedQueryParam, setUsedQueryParam] = useState(false)
  const [context, setContext] = useState<PropertiesContextState>(emptyPropertiesContextState)

  if ((propertyId || subjectType) && !usedQueryParam) {
    setContext({
      ...context,
      subjectType: subjectTypeList.find(value => value === subjectType) ? subjectType as SubjectType : undefined,
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
            <PropertyDisplay/> // TODO property list
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
