import React, { useState } from 'react'
import Link from 'next/link'
import { tw } from '@helpwave/common/twind'
import { Menu, MenuItem } from '@helpwave/common/components/user_input/Menu'
import { Avatar } from './Avatar'
import { useAuth } from '.././hooks/useAuth'
import { LanguageModal } from '@helpwave/common/components/modals/LanguageModal'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type UserMenuTranslation = {
  profile: string,
  language: string,
  signOut: string
}

const defaultUserMenuTranslations: Record<Languages, UserMenuTranslation> = {
  en: {
    profile: 'Profile',
    language: 'Language',
    signOut: 'Sign Out',
  },
  de: {
    profile: 'Profil',
    language: 'Sprache',
    signOut: 'Ausloggen',
  }
}

export const UserMenu = ({
  language,
}: PropsWithLanguage<UserMenuTranslation>) => {
  const translation = useTranslation(language, defaultUserMenuTranslations)
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false)
  const { user, signOut } = useAuth()

  if (!user) return null

  // TODO update this when introducing proper auth
  const settingsURL = 'https://auth.helpwave.de/ui/settings'

  return (
    <div className={tw('relative')}>
      <LanguageModal onDone={() => setLanguageModalOpen(false)} isOpen={isLanguageModalOpen}></LanguageModal>

      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick} className={tw('flex gap-2 relative items-center group cursor-pointer select-none')}>
          <div className={tw('text-sm font-semibold text-slate-700 group-hover:text-indigo-400')}>{user.email}</div>
          <Avatar avatarUrl="" alt={user.email} size="small" />
      </div>
      )}>
        <Link href={settingsURL} target="_blank"><MenuItem alignment="left">{translation.profile}</MenuItem></Link>
        <div className="cursor-pointer" onClick={() => setLanguageModalOpen(true)}><MenuItem alignment="left">{translation.language}</MenuItem></div>
        <div className="cursor-pointer" onClick={() => signOut()}><MenuItem alignment="left">{translation.signOut}</MenuItem></div>
      </Menu>
    </div>
  )
}
