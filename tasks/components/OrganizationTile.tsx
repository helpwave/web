import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'
import Email from '@helpwave/common/icons/Email'
import { AvatarGroup } from './AvatarGroup'

type OrganizationTileTranslation = {
  edit: string,
  other: string,
  others: string
}

const defaultOrganizationTileTranslations: Record<Languages, OrganizationTileTranslation> = {
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

export type OrganizationTileProps = CardProps & {
  displayedAvatars?: number,
  organization: OrganizationDTO,
  onEditClick?: () => void
}

export const OrganizationTile = ({
  language,
  displayedAvatars = 5,
  isSelected,
  organization,
  onTileClick = () => undefined,
  onEditClick = () => undefined
}: PropsWithLanguage<OrganizationTileTranslation, OrganizationTileProps>) => {
  const translation = useTranslation(language, defaultOrganizationTileTranslations)
  const notDisplayedWards = Math.max(0, organization.wards.length - displayedAvatars)

  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group cursor-pointer')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <span className={tw('font-bold font-space')}>{`${organization.longName} (${organization.shortName})`}</span>
        <button onClick={onEditClick}
                className={tw('hidden group-hover:block')}>
            {translation.edit}
        </button>
      </div>
      <div className={tw('text-left my-1 font-semibold text-gray-600 text-sm')}>
        {organization.wards.slice(0, displayedAvatars).map(value => value.name).join(', ')}
        {notDisplayedWards > 0 && (<span className={tw('ml-1')}>{`+ ${notDisplayedWards} ${notDisplayedWards === 1 ? translation.other : translation.others}`}</span>)}
      </div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row items-center')}>
          <Email />
          <span className={tw('ml-2 text-sm')}>{organization.email}</span>
        </div>
        <AvatarGroup users={organization.members}/>
      </div>
    </Card>
  )
}
