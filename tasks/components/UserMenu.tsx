import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, MenuItem } from '@helpwave/hightide/components/user-input/Menu'
import { LanguageModal } from '@helpwave/hightide/components/modals/LanguageModal'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import { Avatar } from '@helpwave/hightide/components/Avatar'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { getAPIServiceConfig } from '@helpwave/api-services/config/config'

const config = getAPIServiceConfig()

type UserMenuTranslation = {
  profile: string,
  language: string,
  signOut: string,
  taskTemplates: string,
  invitations: string,
  organizations: string,
  properties: string,
}

const defaultUserMenuTranslations: Record<Languages, UserMenuTranslation> = {
  en: {
    profile: 'Profile',
    language: 'Language',
    signOut: 'Sign Out',
    taskTemplates: 'Task Templates',
    invitations: 'Invitations',
    organizations: 'Organizations',
    properties: 'Properties'
  },
  de: {
    profile: 'Profil',
    language: 'Sprache',
    signOut: 'Ausloggen',
    taskTemplates: 'Vorlagen',
    invitations: 'Einladungen',
    organizations: 'Organisationen',
    properties: 'Properties'
  }
}

/**
 * A component showing a menu for user actions. For example editing the profile, language and logout.
 */
export const UserMenu = ({
  overwriteTranslation,
}: PropsForTranslation<UserMenuTranslation>) => {
  const translation = useTranslation(defaultUserMenuTranslations, overwriteTranslation)
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  // The settings path "/ui/settings" is hardcoded. It depends strongly on the implementation of the Ory UI.
  const settingsURL = `${config.oauth.issuerUrl}/ui/settings`

  return (
    <div className="relative z-10">
      <LanguageModal
        id="userMenu-LanguageModal"
        onDone={() => setLanguageModalOpen(false)}
        onBackgroundClick={() => setLanguageModalOpen(false)}
        onCloseClick={() => setLanguageModalOpen(false)}
        isOpen={isLanguageModalOpen}
      />
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick}
             className="gap-2 relative items-center group cursor-pointer select-none">
          {/* TODO set this color in the css config */}
          <div className="text-sm font-semibold text-gray-700 group-hover:text-primary">{user.name}</div>
          <Avatar avatarUrl={user.avatarUrl} alt={user.email} size="small"/>
        </div>
      )}>
        <Link href={settingsURL} target="_blank"><MenuItem alignment="left">{translation.profile}</MenuItem></Link>
        <div className="cursor-pointer" onClick={() => setLanguageModalOpen(true)}><MenuItem
          alignment="left">{translation.language}</MenuItem></div>
        <div className="cursor-pointer" onClick={() => router.push('/templates')}>
          <MenuItem alignment="left">{translation.taskTemplates}</MenuItem>
        </div>
        <div className="cursor-pointer" onClick={() => router.push('/properties')}>
          <MenuItem alignment="left">{translation.properties}</MenuItem>
        </div>
        <div className="cursor-pointer" onClick={() => router.push('/organizations')}>
          <MenuItem alignment="left">{translation.organizations}</MenuItem>
        </div>
        <div className="cursor-pointer" onClick={() => router.push('/invitations')}>
          <MenuItem alignment="left">{translation.invitations}</MenuItem>
        </div>
        <div
          className="cursor-pointer text-negative hover:brightness-75"
          onClick={() => signOut()}
        >
          <MenuItem alignment="left">{translation.signOut}</MenuItem>
        </div>
      </Menu>
    </div>
  )
}
