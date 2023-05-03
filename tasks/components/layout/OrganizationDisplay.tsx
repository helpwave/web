import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from '../ColumnTitle'
import { OrganizationCard } from '../cards/OrganizationCard'
import { AddCard } from '../cards/AddCard'
import type { Role } from '../OrganizationMemberList'
import { useRouter } from 'next/router'
import { emptyOrganization } from '../../pages/organizations'

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

type WardDTO = {
  name: string
}

type OrgMember = {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

type OrganizationDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  wards: WardDTO[],
  members: OrgMember[]
}

export type OrganizationDisplayProps = {
  selectedOrganization: OrganizationDTO,
  organizations: OrganizationDTO[],
  onSelectionChange: (organization: OrganizationDTO) => void
}

/**
 * The right side of the organizations page showing the list of organizations
 */
export const OrganizationDisplay = ({
  language,
  selectedOrganization,
  organizations,
  onSelectionChange
}: PropsWithLanguage<OrganizationDisplayTranslation, OrganizationDisplayProps>) => {
  const translation = useTranslation(language, defaultOrganizationDisplayTranslations)
  const router = useRouter()

  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.yourOrganizations}/>
      <div className={tw('grid grid-cols-2 gap-6')}>
        {organizations.map(organization => (
          <OrganizationCard
            key={organization.longName}
            organization={organization}
            isSelected={selectedOrganization.id === organization.id}
            onEditClick={() => onSelectionChange(organization)}
            onTileClick={async () => await router.push(`/organizations/${organization.id}`)}
          />
        ))}
        <AddCard
          text={translation.addOrganization}
          onTileClick={() => onSelectionChange(emptyOrganization)}
          isSelected={selectedOrganization.id === ''}
          className={tw('h-24')}
        />
      </div>
    </div>
  )
}
