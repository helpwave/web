import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { CardProps } from './Card'
import { Card } from './Card'
import Email from '@helpwave/common/icons/Email'
import { AvatarGroup } from './AvatarGroup'

type OrganizationTileTranslation = {
  edit: string
}

const defaultOrganizationTileTranslations: Record<Languages, OrganizationTileTranslation> = {
  en: {
    edit: 'Edit'
  },
  de: {
    edit: 'Bearbeiten'
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
  organization: OrganizationDTO,
  onEditClick?: () => void
}

export const OrganizationTile = ({
  language,
  isSelected,
  organization,
  onTileClick = () => undefined,
  onEditClick = () => undefined
}: PropsWithLanguage<OrganizationTileTranslation, OrganizationTileProps>) => {
  const translation = useTranslation(language, defaultOrganizationTileTranslations)
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
        {organization.wards.map(value => value.name).join(', ')}
      </div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row')}>
          <Email />
          <div className={tw('ml-2')}>{organization.email}</div>
        </div>
        <AvatarGroup users={organization.members}/>
      </div>
    </Card>
  )
}
