import { Span } from '@helpwave/common/components/Span'
import { tw, tx } from '@helpwave/common/twind'
import { Avatar } from './Avatar'

// TODO replace later
type UserDTO = {
  avatarURL: string,
  name: string
}

export type AvatarGroupProps = {
  users: UserDTO[],
  maxShownProfiles?: number
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
  users,
  maxShownProfiles = 5
}: AvatarGroupProps) => {
  const displayedProfiles = users.length < maxShownProfiles ? users : users.slice(0, maxShownProfiles)
  const diameter = 24 // 24px
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = users.length - maxShownProfiles
  const avatarGroupWidth = diameter * (stackingOverlap * (displayedProfiles.length - 1) + 1)
  return (
    <div className={tw(`h-[${diameter + 'px'}] flex flex-row relative`)}>
      <div className={tw(`w-[${avatarGroupWidth}px]`)}>
        {displayedProfiles.map((user, index) => (
          <div key={user.name} className={tx(`absolute left-[${(index * diameter * stackingOverlap) + 'px'}] z-[${maxShownProfiles - index}]`)}>
            <Avatar key={user.name} avatarUrl={user.avatarURL} alt={user.name} size="tiny"/>
          </div>
        ))}
      </div>
      {
        notDisplayedProfiles > 0 && (
          <div
            className={tx('truncate ml-1')}>
            <Span>+ {notDisplayedProfiles}</Span>
          </div>
        )
      }
    </div>
  )
}
