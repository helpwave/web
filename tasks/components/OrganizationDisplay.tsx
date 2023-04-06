import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from './ColumnTitle'
import { OrganizationCard } from './OrganizationCard'
import { OrganizationAddCard } from './OrganizationAddCard'
import type { Role } from './OrganizationMemberList'

type OrganizationDisplayTranslation = {
  yourOrganizations: string
}

const defaultOrganizationDisplayTranslations: Record<Languages, OrganizationDisplayTranslation> = {
  en: {
    yourOrganizations: 'Your Organizations'
  },
  de: {
    yourOrganizations: 'Deine Organizationen'
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
  selectedOrganization: OrganizationDTO | undefined,
  organizations: OrganizationDTO[],
  onSelectionChange: (organization: OrganizationDTO | undefined) => void
}

export const OrganizationDisplay = ({
  language,
  selectedOrganization,
  organizations,
  onSelectionChange
}: PropsWithLanguage<OrganizationDisplayTranslation, OrganizationDisplayProps>) => {
  const translation = useTranslation(language, defaultOrganizationDisplayTranslations)

  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.yourOrganizations}/>
      <div className={tw('grid grid-cols-2 gap-6')}>
        {organizations.map(organization => (
          <OrganizationCard
            key={organization.longName}
            organization={organization}
            isSelected={selectedOrganization === organization}
            onEditClick={() => onSelectionChange(organization)}
            onTileClick={() => {
              // TODO open ward view for organization
            }}
          />
        ))}
        <OrganizationAddCard onTileClick={() => onSelectionChange(undefined)} isSelected={selectedOrganization === undefined} />
      </div>
    </div>
  )
}
