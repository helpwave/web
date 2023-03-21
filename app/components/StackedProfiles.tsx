import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type StackedProfilesTranslation = {
  others: (users: number) => string
}

const defaultStackedProfilesTranslations: Record<Languages, StackedProfilesTranslation> = {
  en: {
    others: (users: number) => users === 1 ? 'other' : 'others'
  },
  de: {
    others: (users: number) => users === 1 ? 'weiterer' : 'weitere'
  }
}

// TODO replace later
type UserDTO = {
  color: string,
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
  const height = 24 // 24px
  const stackingOverlap = 0.5 // given as a percentage

  return (
    <div className={tw(`h-[${height + 'px'}] flex flex-row relative`)}>
      {displayedProfiles.map((user, index) => (
        <div key={user.name}
             className={tx(`h-[${height + 'px'}] w-[${height + 'px'}] rounded-full border-1 bg-[${user.color}] absolute left-[${(index * height * stackingOverlap) + 'px'}] z-[${maxShownProfiles - index}]`)}/>
      ))}
      <div className={tx(`ml-[${((maxShownProfiles + 1) * height * stackingOverlap + 4) + 'px'}]`, { hidden: users.length <= maxShownProfiles })}>
        <span>{`+ ${(users.length - maxShownProfiles)} ${translation.others(users.length - maxShownProfiles)}`}</span>
      </div>
    </div>
  )
}
