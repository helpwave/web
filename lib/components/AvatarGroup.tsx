import { tw, tx } from '../twind'
import type { AvatarProps, AvatarSize } from './Avatar'
import { Avatar, avtarSizeMapping } from './Avatar'
import { Span } from './Span'

export type AvatarGroupProps = {
  avatars: Omit<AvatarProps, 'size'>[],
  maxShownProfiles?: number,
  size?: AvatarSize,
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
  avatars,
  maxShownProfiles = 5,
  size = 'tiny'
}: AvatarGroupProps) => {
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const diameter = avtarSizeMapping[size]
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = avatars.length - maxShownProfiles
  const avatarGroupWidth = diameter * (stackingOverlap * (displayedProfiles.length - 1) + 1)
  return (
    <div className={tw(`h-[${diameter}px] flex flex-row relative`)}>
      <div className={tw(`w-[${avatarGroupWidth}px]`)}>
        {displayedProfiles.map((avatar, index) => (
          <div key={index} className={tx(`absolute left-[${(index * diameter * stackingOverlap)}px] z-[${maxShownProfiles - index}]`)}>
            <Avatar avatarUrl={avatar.avatarUrl} alt={avatar.alt} size={size}/>
          </div>
        ))}
      </div>
      {
        notDisplayedProfiles > 0 && (
          <div
            className={tx(`truncate ml-[${1 + diameter / 16}px] flex flex-row items-center text-[${diameter / 2}px]`)}>
            <Span>+ {notDisplayedProfiles}</Span>
          </div>
        )
      }
    </div>
  )
}
