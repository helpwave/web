import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ProfilePicture } from './ProfilePicture'

type ProfileGroupTranslation = {
  other: string,
  others: string
}

const defaultProfileGroupTranslations: Record<Languages, ProfileGroupTranslation> = {
  en: {
    other: 'other',
    others: 'others'
  },
  de: {
    other: 'weiterer',
    others: 'weitere'
  }
}

// TODO replace later
type UserDTO = {
  avatarURL: string,
  name: string
}

export type ProfileGroupProps = {
  users: UserDTO[],
  maxShownProfiles?: number
}

export const ProfileGroup = ({
  language,
  users,
  maxShownProfiles = 5
}: PropsWithLanguage<ProfileGroupTranslation, ProfileGroupProps>) => {
  const translation = useTranslation(language, defaultProfileGroupTranslations)
  const displayedProfiles = users.length < maxShownProfiles ? users : users.slice(0, maxShownProfiles)
  const diameter = 24 // 24px
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = users.length - maxShownProfiles
  return (
    <div className={tw(`h-[${diameter + 'px'}] flex flex-row relative`)}>
      {displayedProfiles.map((user, index) => (
        <div key={user.name} className={tx(`absolute left-[${(index * diameter * stackingOverlap) + 'px'}] z-[${maxShownProfiles - index}]`)}>
          <ProfilePicture key={user.name} avatarUrl={user.avatarURL} alt={user.name} size="tiny"/>
        </div>
      ))}
      {notDisplayedProfiles <= 0 ? null :
          (
          <div
            className={tx(`ml-[${((maxShownProfiles + 1) * diameter * stackingOverlap + 4) + 'px'}]`)}>
            <span>{`+ ${(notDisplayedProfiles)} ${notDisplayedProfiles > 1 ? translation.others : translation.other}`}</span>
          </div>
          )
      }
    </div>
  )
}
