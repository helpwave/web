
import { Mail } from 'lucide-react'
import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { AvatarGroup } from '@helpwave/hightide'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'
import { EditCard, type EditCardProps } from './EditCard'

type OrganizationCardTranslation = {
  member: string,
  members: string,
}

const defaultOrganizationCardTranslation: Translation<OrganizationCardTranslation> = {
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
  organization: OrganizationDTO,
}

/**
 * A Card displaying a Organization
 */
export const OrganizationCard = ({
  overwriteTranslation,
  organization,
  ...editCardProps
}: PropsForTranslation<OrganizationCardTranslation, OrganizationCardProps>) => {
  const translation = useTranslation(defaultOrganizationCardTranslation, overwriteTranslation)
  const organizationMemberCount = organization.members.length

  return (
    <EditCard {...editCardProps}>
      <div className="col gap-y-2 overflow-hidden">
        <div className="row gap-x-1 font-bold font-space overflow-hidden">
          <span className="truncate flex-1">
            {`${organization.longName}`}
          </span>
          <span>{`(${organization.shortName})`}</span>
        </div>
        <div className="row items-center overflow-hidden gap-x-2">
          <Mail/>
          <span className="w-full truncate text-sm">{organization.email}</span>
        </div>
        <div className="row justify-between">
          <div className="text-left my-1 font-semibold text-gray-600 text-sm truncate">
            {`${organizationMemberCount} ${organizationMemberCount > 1 ? translation.members : translation.member}`}
          </div>
          <AvatarGroup avatars={organization.members.map(user => ({ avatarUrl: user.avatarURL, alt: user.name }))}/>
        </div>
      </div>
    </EditCard>
  )
}
