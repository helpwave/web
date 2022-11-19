import { ProfilePicture } from './ProfilePicture'
import type { User } from '../hooks/useAuth'

export type UserCardProps = {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="flex flex-row w-80 h-22 rounded-lg border-2">
      <div className="p-2">
        <ProfilePicture avatarUrl={user.avatarUrl} altText="profile picture" size="large" />
      </div>
      <div className="p-2 w-56 h-20">
        <div className="text-lg font-semibold leading-normal text-slate-600 truncate">{user.displayName}</div>
        <div className="text-sm text-slate-500 truncate">{user.fullName}</div>
        <div className="text-sm text-slate-500 truncate">{user.email}</div>
      </div>
    </div>
  )
}

export { UserCard }
