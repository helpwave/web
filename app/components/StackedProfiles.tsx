import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ProfilePicture } from './ProfilePicture'

type StackedProfilesTranslation = {
  others: (isMultipleUsers: boolean) => string
}

const defaultStackedProfilesTranslations: Record<Languages, StackedProfilesTranslation> = {
  en: {
    others: (isMultipleUsers: boolean) => isMultipleUsers ? 'other' : 'others'
  },
  de: {
    others: (isMultipleUsers: boolean) => isMultipleUsers ? 'weiterer' : 'weitere'
  }
}

// TODO replace later
type UserDTO = {
  avatarURL: string,
  name: string
}

export type StackedProfilesProps = {
  users: UserDTO[],
  maxShownProfiles?: number
}

export const StackedProfiles = ({
  language,
  users,
  maxShownProfiles = 5
}: PropsWithLanguage<StackedProfilesTranslation, StackedProfilesProps>) => {
  const translation = useTranslation(language, defaultStackedProfilesTranslations)
  const displayedProfiles = users.length < maxShownProfiles ? users : users.slice(0, maxShownProfiles)
  const diameter = 24 // 24px
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = users.length - maxShownProfiles
  return (
    <div className={tw(`h-[${diameter + 'px'}] flex flex-row relative`)}>
      {displayedProfiles.map((user, index) => (
        <div key={user.name} className={tx(`absolute left-[${(index * diameter * stackingOverlap) + 'px'}] z-[${maxShownProfiles - index}]`)}>
          <ProfilePicture key={user.name} avatarUrl={user.avatarURL} altText="" size="tiny"/>
        </div>
      ))}
      {notDisplayedProfiles <= 0 ? null :
          (
          <div
            className={tx(`ml-[${((maxShownProfiles + 1) * diameter * stackingOverlap + 4) + 'px'}]`)}>
            <span>{`+ ${(notDisplayedProfiles)} ${translation.others(notDisplayedProfiles > 1)}`}</span>
          </div>
          )
      }
    </div>
  )
}
