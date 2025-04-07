import Image from 'next/image'
import { tx } from '@helpwave/style-themes/twind'

export const avtarSizeList = ['tiny', 'small', 'medium', 'large'] as const
export type AvatarSize = typeof avtarSizeList[number]
export const avtarSizeMapping: Record<AvatarSize, number> = {
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
  const usedSize = avtarSizeMapping[size]
  return (
    // TODO transparent or white background later
    <div
      className={tx(`@(rounded-full bg-hw-primary-400 h-[${usedSize}px] w-[${usedSize}px] min-h-[${usedSize}px] min-w-[${usedSize}px])`, className)}>
      <Image
        className={tx(
          'rounded-full border border-slate-200 group-hover:border-indigo-200 flex justify-evenly items-center',
          `h-[${usedSize}px] w-[${usedSize}px] min-h-[${usedSize}px] min-w-[${usedSize}px]`
        )}
        src={avatarUrl}
        alt={alt}
        width={usedSize}
        height={usedSize}
      />
    </div>
  )
}

export { Avatar }
