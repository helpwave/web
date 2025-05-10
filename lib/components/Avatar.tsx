import Image from 'next/image'
import clsx from 'clsx'

export const avtarSizeList = ['tiny', 'small', 'medium', 'large'] as const
export type AvatarSize = typeof avtarSizeList[number]
export const avatarSizeMapping: Record<AvatarSize, number> = {
  tiny: 24,
  small: 32,
  medium: 48,
  large: 64
}

export type AvatarProps = {
  avatarUrl: string,
  alt: string,
  size?: AvatarSize,
  className?: string,
}

/**
 * A component for showing a profile picture
 */
const Avatar = ({ avatarUrl, alt, size = 'medium', className = '' }: AvatarProps) => {
  // TODO remove later
  avatarUrl = 'https://cdn.helpwave.de/boringavatar.svg'

  const avtarSize = {
    tiny: 24,
    small: 32,
    medium: 48,
    large: 64,
  }[size]

  const style = {
    width: avtarSize + 'px',
    height: avtarSize + 'px',
    maxWidth: avtarSize + 'px',
    maxHeight: avtarSize + 'px',
    minWidth: avtarSize + 'px',
    minHeight: avtarSize + 'px',
  }

  return (
    // TODO transparent or white background later
    <div className={clsx(`rounded-full bg-primary`, className)} style={style}>
      <Image
        className="rounded-full border border-gray-200"
        style={style}
        src={avatarUrl}
        alt={alt}
        width={avtarSize}
        height={avtarSize}
      />
    </div>
  )
}

export { Avatar }
