import { tw, tx } from '@helpwave/common/twind'

export type AvatarProps = {
  avatarUrl: string,
  alt: string,
  size?: 'tiny' | 'small' | 'medium' | 'large'
}

const Avatar = ({ avatarUrl, alt, size = 'medium' }: AvatarProps) => {
  return (
    <div className={tw('rounded-full')}>
      <img className={tx('rounded-full border border-slate-200 group-hover:border-indigo-200', {
        'h-6 w-6': size === 'tiny',
        'h-8 w-8': size === 'small',
        'h-12 w-12': size === 'medium',
        'h-16 w-16': size === 'large'
      })} src={avatarUrl} alt={alt} />
    </div>
  )
}

export { Avatar }
