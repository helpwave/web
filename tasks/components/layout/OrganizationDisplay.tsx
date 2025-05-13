import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { getAPIServiceConfig } from '@helpwave/api-services/config/config'
import { useOrganizationsForUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'
import { ColumnTitle } from '../ColumnTitle'
import { OrganizationCard } from '../cards/OrganizationCard'
import { AddCard } from '../cards/AddCard'
import { OrganizationContext } from '@/pages/organizations'
import clsx from 'clsx'

type OrganizationDisplayTranslation = {
  addOrganization: string,
  yourOrganizations: string,
}

const defaultOrganizationDisplayTranslations: Record<Languages, OrganizationDisplayTranslation> = {
  en: {
    addOrganization: 'Add new Organization',
    yourOrganizations: 'Your Organizations'
  },
  de: {
    addOrganization: 'Organisation hinzufügen',
    yourOrganizations: 'Deine Organisationen'
  }
}

export type OrganizationDisplayProps = {
  selectedOrganizationId?: string,
  organizations?: OrganizationDTO[],
  width?: number,
}

/**
 * The right side of the organizations page showing the list of organizations
 */
export const OrganizationDisplay = ({
  overwriteTranslation,
  selectedOrganizationId,
  organizations,
}: PropsForTranslation<OrganizationDisplayTranslation, OrganizationDisplayProps>) => {
  const translation = useTranslation(defaultOrganizationDisplayTranslations, overwriteTranslation)
  const router = useRouter()

  const context = useContext(OrganizationContext)
  const { data } = useOrganizationsForUserQuery()
  let usedOrganizations: OrganizationDTO[] = organizations ?? data ?? []
  const { organizations: tokenOrganizations } = useAuth()
  const { fakeTokenEnable } = getAPIServiceConfig()

  usedOrganizations = usedOrganizations.filter((organization) => fakeTokenEnable || tokenOrganizations.includes(organization.id))

  const usedSelectedId = selectedOrganizationId ?? context.state.organizationId
  return (
    <div className="py-4 px-6">
      <ColumnTitle title={translation.yourOrganizations}/>
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
        {usedOrganizations.map(organization => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            className={clsx('h-full border-2 hover:border-primary', { 'border-primary border-solid': usedSelectedId === organization.id })}
            onEditClick={() => context.updateContext({ ...context.state, organizationId: organization.id })}
            onClick={() => {
              router.push(`/organizations/${organization.id}`)
            }}
          />
        ))}
        <AddCard
          text={translation.addOrganization}
          onClick={() => context.updateContext({ ...context.state, organizationId: '' })}
          className={clsx('h-full', { 'border-primary border-solid': usedSelectedId === '' })}
        />
      </div>
    </div>
  )
}
