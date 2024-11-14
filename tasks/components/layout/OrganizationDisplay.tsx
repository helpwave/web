import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
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

type OrganizationDisplayTranslation = {
  addOrganization: string,
  yourOrganizations: string
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
  width?: number
}

/**
 * The right side of the organizations page showing the list of organizations
 */
export const OrganizationDisplay = ({
  overwriteTranslation,
  selectedOrganizationId,
  organizations,
  width
}: PropsForTranslation<OrganizationDisplayTranslation, OrganizationDisplayProps>) => {
  const translation = useTranslation(defaultOrganizationDisplayTranslations, overwriteTranslation)
  const router = useRouter()

  const context = useContext(OrganizationContext)
  const { data } = useOrganizationsForUserQuery()
  let usedOrganizations: OrganizationDTO[] = organizations ?? data ?? []
  const { organizations: tokenOrganizations } = useAuth()
  const { fakeTokenEnable } = getAPIServiceConfig()

  usedOrganizations = usedOrganizations.filter((organization) => fakeTokenEnable || tokenOrganizations.includes(organization.id))
  const columns = !width ? 3 : Math.min(Math.max(Math.floor(width / 250), 1), 3)

  const usedSelectedId = selectedOrganizationId ?? context.state.organizationId
  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.yourOrganizations}/>
      <div className={tw(`grid grid-cols-${columns} gap-6`)}>
        {usedOrganizations.map(organization => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            isSelected={usedSelectedId === organization.id}
            onEditClick={() => context.updateContext({ ...context.state, organizationId: organization.id })}
            onTileClick={() => {
              router.push(`/organizations/${organization.id}`)
            }}
          />
        ))}
        <AddCard
          text={translation.addOrganization}
          onTileClick={() => context.updateContext({ ...context.state, organizationId: '' })}
          isSelected={usedSelectedId === ''}
          className={tw('h-full')}
        />
      </div>
    </div>
  )
}
