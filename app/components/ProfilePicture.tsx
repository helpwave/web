import { tw, tx } from '@twind/core'

export type ProfilePictureProps = {
  avatarUrl: string,
  altText: string,
  size?: 'small' | 'medium' | 'large'
}

const ProfilePicture = ({ avatarUrl, altText, size = 'medium' }: ProfilePictureProps) => {
  return (
    <div className={tw('rounded-full')}>
      <img className={tx('rounded-full border border-slate-200 group-hover:border-indigo-200', {
        'h-8 w-8': size === 'small',
        'h-12 w-12': size === 'medium',
        'h-16 w-16': size === 'large'
      })} src={avatarUrl} alt={altText} />
    </div>
  )
}

export { ProfilePicture }
