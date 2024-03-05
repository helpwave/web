import { tw } from '@helpwave/common/twind'
import { Mail } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { AvatarGroup } from '../AvatarGroup'
import { EditCard, type EditCardProps } from './EditCard'
import type { OrganizationDTO } from '@/mutations/organization_mutations'

type OrganizationCardTranslation = {
  member: string,
  members: string
}

const defaultOrganizationCardTranslation: Record<Languages, OrganizationCardTranslation> = {
  en: {
    member: 'Member',
    members: 'Members'
  },
  de: {
    member: 'Mitglied',
    members: 'Mitglieder'
  }
}

export type OrganizationCardProps = EditCardProps & {
  maxShownWards?: number,
  organization: OrganizationDTO
}

/**
 * A Card displaying a Organization
 */
export const OrganizationCard = ({
  language,
  organization,
  ...editCardProps
}: PropsWithLanguage<OrganizationCardProps>) => {
  const translation = useTranslation(language, defaultOrganizationCardTranslation)
  const organizationMemberCount = organization.members.length

  return (
    <EditCard {...editCardProps}>
      <div className={tw('flex flex-col gap-y-2 overflow-hidden')}>
        <div className={tw('flex flex-row gap-x-1 font-bold font-space overflow-hidden')}>
          <span className={tw('truncate flex-1')}>
            {`${organization.longName}`}
          </span>
          <span>{`(${organization.shortName})`}</span>
        </div>
        <div className={tw('flex flex-row items-center overflow-hidden gap-x-2')}>
          <Mail/>
          <span className={tw('w-full truncate text-sm')}>{organization.email}</span>
        </div>
        <div className={tw('flex flex-row justify-between')}>
          <div className={tw('text-left my-1 font-semibold text-gray-600 text-sm truncate')}>
            {`${organizationMemberCount} ${organizationMemberCount > 1 ? translation.members : translation.member}`}
          </div>
          <AvatarGroup users={organization.members}/>
        </div>
      </div>
    </EditCard>
  )
}
