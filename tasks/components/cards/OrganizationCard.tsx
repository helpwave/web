import { tw } from '@helpwave/common/twind'
import { Edit, Mail } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { AvatarGroup } from '../AvatarGroup'
import type { OrganizationDTO } from '../../mutations/organization_mutations'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

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

export type OrganizationCardProps = CardProps & {
  maxShownWards?: number,
  organization: OrganizationDTO,
  onEditClick?: () => void
}

/**
 * A Card displaying a Organization
 */
export const OrganizationCard = ({
  language,
  isSelected,
  organization,
  onTileClick = () => undefined,
  onEditClick
}: PropsWithLanguage<Languages, OrganizationCardProps>) => {
  const translation = useTranslation(language, defaultOrganizationCardTranslation)
  const organizationMemberCount = organization.members.length

  return (
    <Card
      onTileClick={onTileClick}
      isSelected={isSelected}
      className={tw('group cursor-pointer justify-between flex flex-col')}
    >
      <div className={tw('flex flex-row justify-between w-full gap-x-2 items-start')}>
        <div className={tw('flex flex-row gap-x-1 font-bold font-space overflow-hidden')}>
          <span
            className={tw('text-ellipsis whitespace-nowrap overflow-hidden flex-1')}>{`${organization.longName}`}</span>
          <span>{`(${organization.shortName})`}</span>
        </div>
        {onEditClick && (
          <button
            onClick={event => {
              onEditClick()
              event.stopPropagation()
            }}
            className={tw('text-transparent group-hover:text-black')}
          >
            <Edit size={24}/>
          </button>
        )}
      </div>
      <div className={tw('truncate flex flex-row items-center')}>
        <Mail/>
        <span className={tw('w-full truncate ml-2 text-sm')}>{organization.email}</span>
      </div>
      <div className={tw('flex flex-row justify-between')}>
        <div className={tw('text-left my-1 font-semibold text-gray-600 text-sm truncate')}>
          {`${organizationMemberCount} ${organizationMemberCount > 1 ? translation.members : translation.member}`}
        </div>
        <AvatarGroup users={organization.members}/>
      </div>
    </Card>
  )
}
