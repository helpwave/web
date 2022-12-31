import React from 'react'
import Link from 'next/link'
import { Menu, MenuItem } from './Menu'
import { ProfilePicture } from './ProfilePicture'
import type { User } from '../hooks/useAuth'

type UserMenuProps = {
  user: User
}

const UserMenu = ({ user }: UserMenuProps) => {
  // TODO: meaningful menu content
  return (
    <div className="relative w-40">
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick} className="flex gap-2 relative items-center group cursor-pointer select-none">
          <ProfilePicture avatarUrl={user.avatarUrl} altText={user.displayName} size="small" />
          <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-400">{user.displayName}</div>
      </div>
      )}>
        <Link href="/profile"><MenuItem alignment="left">Profile</MenuItem></Link>
        <Link href="/settings"><MenuItem alignment="left">Settings</MenuItem></Link>
      </Menu>
    </div>
  )
}

export { UserMenu }
