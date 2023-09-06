import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from '../ColumnTitle'
import { OrganizationCard } from '../cards/OrganizationCard'
import { AddCard } from '../cards/AddCard'
import { useRouter } from 'next/router'
import type { OrganizationDTO } from '../../mutations/organization_mutations'
import { useOrganizationsForUserQuery } from '../../mutations/organization_mutations'
import { useContext } from 'react'
import { OrganizationContext } from '../../pages/organizations'

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
  language,
  selectedOrganizationId,
  organizations,
  width
}: PropsWithLanguage<OrganizationDisplayTranslation, OrganizationDisplayProps>) => {
  const translation = useTranslation(language, defaultOrganizationDisplayTranslations)
  const router = useRouter()

  const context = useContext(OrganizationContext)
  const { data } = useOrganizationsForUserQuery()
  const usedOrganizations: OrganizationDTO[] = organizations ?? data ?? []

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
            onTileClick={async () => await router.push(`/organizations/${organization.id}`)}
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
