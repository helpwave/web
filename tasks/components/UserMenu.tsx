import React from 'react'
import Link from 'next/link'
import { tw } from '@helpwave/common/twind'
import { Menu, MenuItem } from '@helpwave/common/components/user_input/Menu'
import { Avatar } from './Avatar'
import type { User } from '../hooks/useAuthOld'

type UserMenuProps = {
  user: User
}

const UserMenu = ({ user }: UserMenuProps) => {
  // TODO: meaningful menu content
  return (
    <div className={tw('relative')}>
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick} className={tw('flex gap-2 relative items-center group cursor-pointer select-none')}>
          <div className={tw('text-sm font-semibold text-slate-700 group-hover:text-indigo-400')}>{user.displayName}</div>
          <Avatar avatarUrl={user.avatarUrl} alt={user.displayName} size="small" />
      </div>
      )}>
        <Link href="https://auth.helpwave.de/ui/settings"><MenuItem alignment="left">Profile</MenuItem></Link>
        <Link href="https://auth.helpwave.de/ui/settings"><MenuItem alignment="left">Settings</MenuItem></Link>
      </Menu>
    </div>
  )
}

export { UserMenu }
