import { tw, tx } from '@helpwave/common/twind'

export type AvatarProps = {
  avatarUrl: string,
  alt: string,
  size?: 'tiny' | 'small' | 'medium' | 'large'
}

/**
 * A component for showing a profile picture
 */
const Avatar = ({ avatarUrl, alt, size = 'medium' }: AvatarProps) => {
  avatarUrl = 'https://source.boringavatars.com/beam' // TODO remove later when we use our own service
  return (
    <div className={tw('rounded-full')}>
      <img className={tx('rounded-full border border-slate-200 group-hover:border-indigo-200  flex justify-evenly items-center', {
        'h-6 w-6 min-h-[24px] min-w-[24px]': size === 'tiny',
        'h-8 w-8 min-h-[32px] min-w-[32px]': size === 'small',
        'h-12 w-12 min-h-[48px] min-w-[48px]': size === 'medium',
        'h-16 w-16 min-h-[64px] min-w-[64px]': size === 'large'
      })} src={avatarUrl} alt={alt} />
    </div>
  )
}

export { Avatar }
