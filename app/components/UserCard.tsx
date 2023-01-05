import { tw } from '@twind/core'
import { ProfilePicture } from './ProfilePicture'
import type { User } from '../hooks/useAuth'

export type UserCardProps = {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className={tw('flex flex-row w-80 h-22 rounded-lg border-2')}>
      <div className={tw('p-2')}>
        <ProfilePicture avatarUrl={user.avatarUrl} altText="profile picture" size="large" />
      </div>
      <div className={tw('p-2 w-56 h-20')}>
        <div className={tw('text-lg font-semibold leading-normal text-slate-600 truncate')}>{user.displayName}</div>
        <div className={tw('text-sm text-slate-500 truncate')}>{user.fullName}</div>
        <div className={tw('text-sm text-slate-500 truncate')}>{user.email}</div>
      </div>
    </div>
  )
}

export { UserCard }
