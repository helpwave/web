import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'
import Email from '@helpwave/common/icons/Email'
import { AvatarGroup } from '../AvatarGroup'
import { Edit } from 'lucide-react'

type OrganizationCardTranslation = {
  edit: string,
  other: string,
  others: string
}

const defaultOrganizationCardTranslations: Record<Languages, OrganizationCardTranslation> = {
  en: {
    edit: 'Edit',
    other: 'other',
    others: 'others'
  },
  de: {
    edit: 'Bearbeiten',
    other: 'weiterer',
    others: 'othere'
  }
}

type WardDTO = {
  name: string
}

type UserDTO = {
  name: string,
  avatarURL: string
}

type OrganizationDTO = {
  longName: string,
  shortName: string,
  wards: WardDTO[],
  email: string,
  members: UserDTO[]
}

export type OrganizationCardProps = CardProps & {
  maxShownWards?: number,
  organization: OrganizationDTO,
  onEditClick?: () => void
}

export const OrganizationCard = ({
  language,
  maxShownWards = 5,
  isSelected,
  organization,
  onTileClick = () => undefined,
  onEditClick = () => undefined
}: PropsWithLanguage<OrganizationCardTranslation, OrganizationCardProps>) => {
  const translation = useTranslation(language, defaultOrganizationCardTranslations)
  const notDisplayedWards = Math.max(0, organization.wards.length - maxShownWards)

  return (
    <Card onTileClick={onTileClick} isSelected={isSelected}
          className={tw('group cursor-pointer justify-between flex flex-col')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <span className={tw('font-bold font-space')}>{`${organization.longName} (${organization.shortName})`}</span>
        <button
          onClick={event => {
            onEditClick()
            event.stopPropagation()
          }}
          className={tw('hidden group-hover:block')}
        >
          <Edit color="black" size={24} />
        </button>
      </div>
      <div className={tw('text-left my-1 font-semibold text-gray-600 text-sm')}>
        {organization.wards.slice(0, maxShownWards).map(value => value.name).join(', ')}
        {notDisplayedWards > 0 && (
<span
          className={tw('ml-1')}>{`+ ${notDisplayedWards} ${notDisplayedWards === 1 ? translation.other : translation.others}`}</span>
        )}
      </div>
      <div className={tw('flex flex-row justify-between')}>
        <div className={tw('truncate flex flex-row items-center')}>
          <Email/>
          <span className={tw('w-full truncate ml-2 text-sm')}>{organization.email}</span>
        </div>
        <AvatarGroup users={organization.members}/>
      </div>
    </Card>
  )
}
