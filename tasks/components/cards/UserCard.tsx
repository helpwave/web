
import { Avatar } from '@helpwave/hightide/components/Avatar'
import type { User } from '@helpwave/api-services/authentication/useAuth'

export type UserCardProps = {
  user: User,
}

/**
 * A Card showing the Avatar and name of a user
 */
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="row w-80 h-22 rounded-lg border-2">
      <div className="p-2">
        <Avatar avatarUrl={user.avatarUrl} alt="profile picture" size="large" />
      </div>
      <div className="p-2 w-56 h-20">
        <div className="text-lg font-semibold leading-normal text-slate-600 truncate">{user.nickname}</div>
        <div className="text-sm text-slate-500 truncate">{user.name}</div>
        <div className="text-sm text-slate-500 truncate">{user.email}</div>
      </div>
    </div>
  )
}

export { UserCard }
