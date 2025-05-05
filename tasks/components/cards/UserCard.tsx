import clsx from 'clsx'
import { Avatar } from '@helpwave/common/components/Avatar'
import type { User } from '@helpwave/api-services/authentication/useAuth'

export type UserCardProps = {
  user: User,
}

/**
 * A Card showing the Avatar and name of a user
 */
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className={clsx('row w-80 h-22 rounded-lg border-2')}>
      <div className={clsx('p-2')}>
        <Avatar avatarUrl={user.avatarUrl} alt="profile picture" size="large" />
      </div>
      <div className={clsx('p-2 w-56 h-20')}>
        <div className={clsx('text-lg font-semibold leading-normal text-slate-600 truncate')}>{user.nickname}</div>
        <div className={clsx('text-sm text-slate-500 truncate')}>{user.name}</div>
        <div className={clsx('text-sm text-slate-500 truncate')}>{user.email}</div>
      </div>
    </div>
  )
}

export { UserCard }
