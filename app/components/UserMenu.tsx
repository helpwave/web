import React from 'react'
import { Menu, MenuItem } from './Menu'
import type { User } from '../hooks/useAuth'

type UserMenuProps = {
  user: User
}

const UserMenu = ({ user }: UserMenuProps) => {
  // TODO: meaningful menu content
  // TODO: proper avatars
  return (
    <div className="relative">
      <Menu<HTMLDivElement> trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick} className="flex gap-2 relative items-center group cursor-pointer select-none">
          <div className="rounded-full">
            <img className="rounded-full h-8 w-8 border border-slate-200 group-hover:border-indigo-200" src="https://source.boringavatars.com/" alt={user.username} />
          </div>
          <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-400">{user.username}</div>
      </div>
      )}>
        <MenuItem>menu!</MenuItem>
        <MenuItem>menu!</MenuItem>
        <MenuItem>menu!</MenuItem>
        <MenuItem>menu!</MenuItem>
      </Menu>
    </div>
  )
}

export { UserMenu }
