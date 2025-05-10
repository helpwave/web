import type { AvatarProps, AvatarSize } from './Avatar'
import { Avatar, avatarSizeMapping } from './Avatar'

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
  const diameter = avatarSizeMapping[size]
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = avatars.length - maxShownProfiles
  const avatarGroupWidth = diameter * (stackingOverlap * (displayedProfiles.length - 1) + 1)
  return (
    <div className="row relative" style={{ height: diameter + 'px' }}>
      <div style={{ width: avatarGroupWidth + 'px' }}>
        {displayedProfiles.map((avatar, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: (index * diameter * stackingOverlap) + 'px', zIndex: maxShownProfiles - index }}
          >
            <Avatar avatarUrl={avatar.avatarUrl} alt={avatar.alt} size={size}/>
          </div>
        ))}
      </div>
      {
        notDisplayedProfiles > 0 && (
          <div
            className="truncate row items-center"
            style={{ fontSize: (diameter / 2) + 'px', marginLeft: (1 + diameter / 16) + 'px' }}
          >
            <span>+ {notDisplayedProfiles}</span>
          </div>
        )
      }
    </div>
  )
}
