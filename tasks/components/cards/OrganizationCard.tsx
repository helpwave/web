import { tw } from '@helpwave/common/twind'
import { Edit, Mail } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { AvatarGroup } from '../AvatarGroup'
import type { OrganizationWitWardNamesDTO } from '../../mutations/organization_mutations'

export type OrganizationCardProps = CardProps & {
  maxShownWards?: number,
  organization: OrganizationWitWardNamesDTO,
  onEditClick?: () => void
}

/**
 * A Card displaying a Organization
 */
export const OrganizationCard = ({
  maxShownWards = 5,
  isSelected,
  organization,
  onTileClick = () => undefined,
  onEditClick
}: OrganizationCardProps) => {
  const notDisplayedWards = Math.max(0, organization.wardNames.length - maxShownWards)

  return (
    <Card
      onTileClick={onTileClick}
      isSelected={isSelected}
      className={tw('group cursor-pointer justify-between flex flex-col')}
    >
      <div className={tw('flex flex-row justify-between w-full gap-x-2 items-start')}>
        <div className={tw('flex flex-row gap-x-1 font-bold font-space overflow-hidden')}>
          <span className={tw('text-ellipsis whitespace-nowrap overflow-hidden flex-1')}>{`${organization.longName}`}</span>
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
      <div className={tw('text-left my-1 font-semibold text-gray-600 text-sm')}>
        {organization.wardNames.slice(0, maxShownWards).join(', ')}
        {notDisplayedWards > 0 && (
          <span className={tw('ml-1')}>
            + {notDisplayedWards}
          </span>
        )}
      </div>
      <div className={tw('flex flex-row justify-between')}>
        <div className={tw('truncate flex flex-row items-center')}>
          <Mail/>
          <span className={tw('w-full truncate ml-2 text-sm')}>{organization.email}</span>
        </div>
        <AvatarGroup users={organization.members}/>
      </div>
    </Card>
  )
}
