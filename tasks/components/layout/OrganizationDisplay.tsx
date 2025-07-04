import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { getAPIServiceConfig } from '@helpwave/api-services/config/config'
import { useOrganizationsForUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'
import { ColumnTitle } from '../ColumnTitle'
import { OrganizationCard } from '../cards/OrganizationCard'
import { OrganizationContext } from '@/pages/organizations'

type OrganizationDisplayTranslation = {
  addOrganization: string,
  yourOrganizations: string,
}

const defaultOrganizationDisplayTranslations: Translation<OrganizationDisplayTranslation> = {
  en: {
    addOrganization: 'Add Organization',
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

  usedOrganizations = usedOrganizations
    .filter((organization) => fakeTokenEnable || tokenOrganizations.includes(organization.id))
    .filter((organization) => tokenOrganizations.includes(organization.id))

  const usedSelectedId = selectedOrganizationId ?? context.state.organizationId
  return (
    <div className="py-4 px-6 @container">
      <ColumnTitle title={translation.yourOrganizations}/>
      <div className="grid @max-md:grid-cols-1 gap-6">
        {usedOrganizations.map(organization => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            isSelected={usedSelectedId === organization.id}
            onEditClick={() => context.updateContext({ ...context.state, organizationId: organization.id })}
            onClick={() => {
              router.push(`/organizations/${organization.id}`)
            }}
          />
        ))}
        {
          /* Show again when multi organization should be re-enabled
          <AddCard
            text={translation.addOrganization}
            onClick={() => context.updateContext({ ...context.state, organizationId: '' })}
            isSelected={!!usedSelectedId}
          />
          */
        }
      </div>
    </div>
  )
}
