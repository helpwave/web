import React, { useState } from 'react'
import Link from 'next/link'
import { tw } from '@helpwave/common/twind'
import { Menu, MenuItem } from '@helpwave/common/components/user_input/Menu'
import { Avatar } from './Avatar'
import { useAuth } from '../hooks/useAuth'
import { LanguageModal } from '@helpwave/common/components/modals/LanguageModal'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { getConfig } from '../utils/config'
import { useRouter } from 'next/router'

const config = getConfig()

type UserMenuTranslation = {
  profile: string,
  language: string,
  signOut: string,
  taskTemplates: string,
  invitations: string
}

const defaultUserMenuTranslations: Record<Languages, UserMenuTranslation> = {
  en: {
    profile: 'Profile',
    language: 'Language',
    signOut: 'Sign Out',
    taskTemplates: 'Task Templates',
    invitations: 'Invitations'
  },
  de: {
    profile: 'Profil',
    language: 'Sprache',
    signOut: 'Ausloggen',
    taskTemplates: 'Task Templates',
    invitations: 'Einladungen'
  }
}

/**
 * A component showing a menu for user actions. For example editing the profile, language and logout.
 */
export const UserMenu = ({
  language,
}: PropsWithLanguage<UserMenuTranslation>) => {
  const translation = useTranslation(language, defaultUserMenuTranslations)
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  // The settings path "/ui/settings" is hardcoded. It depends strongly on the implementation of the Ory UI.
  const settingsURL = `${config.oauth.issuerUrl}/ui/settings`

  return (
    <div className={tw('relative z-10')}>
      <LanguageModal onDone={() => setLanguageModalOpen(false)} isOpen={isLanguageModalOpen} />
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick} className={tw('flex gap-2 relative items-center group cursor-pointer select-none')}>
          <div className={tw('text-sm font-semibold text-slate-700 group-hover:text-indigo-400')}>{user.name}</div>
          <Avatar avatarUrl={user.avatarUrl} alt={user.email} size="small" />
      </div>
      )}>
        <Link href={settingsURL} target="_blank"><MenuItem alignment="left">{translation.profile}</MenuItem></Link>
        <div className="cursor-pointer" onClick={() => setLanguageModalOpen(true)}><MenuItem alignment="left">{translation.language}</MenuItem></div>
        <div className={tw('cursor-pointer')} onClick={() => router.push('/templates')}><MenuItem alignment="left">{translation.taskTemplates}</MenuItem></div>
        <div className={tw('cursor-pointer')} onClick={() => router.push('/invitations')}><MenuItem alignment="left">{translation.invitations}</MenuItem></div>
        <div
          className={tw('cursor-pointer text-hw-negative-400 hover:text-hw-negative-500')}
          onClick={() => signOut()}
        >
          <MenuItem alignment="left">{translation.signOut}</MenuItem>
        </div>
      </Menu>
    </div>
  )
}
