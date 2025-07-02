import { useState } from 'react'
import { useRouter } from 'next/router'
import type { Translation } from '@helpwave/hightide'
import {
  Avatar,
  LanguageModal,
  Menu,
  MenuItem,
  type PropsForTranslation,
  ThemeModal,
  useTranslation
} from '@helpwave/hightide'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { getAPIServiceConfig } from '@helpwave/api-services/config/config'
import clsx from 'clsx'

const config = getAPIServiceConfig()

type UserMenuTranslation = {
  profile: string,
  language: string,
  signOut: string,
  taskTemplates: string,
  invitations: string,
  organizations: string,
  properties: string,
  theme: string,
}

const defaultUserMenuTranslations: Translation<UserMenuTranslation> = {
  en: {
    profile: 'Profile',
    language: 'Language',
    signOut: 'Sign Out',
    taskTemplates: 'Task Templates',
    invitations: 'Invitations',
    organizations: 'Organizations',
    properties: 'Properties',
    theme: 'Theme',
  },
  de: {
    profile: 'Profil',
    language: 'Sprache',
    signOut: 'Ausloggen',
    taskTemplates: 'Vorlagen',
    invitations: 'Einladungen',
    organizations: 'Organisationen',
    properties: 'Eigenschaften',
    theme: 'Farbschema',
  }
}

type UserMenuProps = {
  className?: string,
}

/**
 * A component showing a menu for user actions. For example editing the profile, language and logout.
 */
export const UserMenu = ({
                           overwriteTranslation,
                           className,
                         }: PropsForTranslation<UserMenuTranslation, UserMenuProps>) => {
  const translation = useTranslation([defaultUserMenuTranslations], overwriteTranslation)
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false)
  const [isThemeModalOpen, setThemeModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return (<div></div>)

  // The settings path "/ui/settings" is hardcoded. It depends strongly on the implementation of the Ory UI.
  const settingsURL = `${config.oauth.issuerUrl}/ui/settings`

  return (
    <div className={clsx('row relative z-10', className)}>
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick}
             className="row relative items-center group cursor-pointer select-none">
          {/* TODO set this color in the css config */}
          <div className="text-sm font-semibold text-description group-hover:text-primary">{user.name}</div>
          <Avatar avatarUrl={user.avatarUrl} alt={user.email} size="small"/>
        </div>
      )}>
        <MenuItem onClick={() => router.push(settingsURL, '_blank')}>
          {translation('profile')}
        </MenuItem>
        <MenuItem onClick={() => setLanguageModalOpen(true)}>
          {translation('language')}
        </MenuItem>
        <MenuItem onClick={() => setThemeModalOpen(true)}>
          {translation('theme')}
        </MenuItem>
        <MenuItem onClick={() => router.push('/templates')}>
          {translation('taskTemplates')}
        </MenuItem>
        <MenuItem onClick={() => router.push('/properties')}>
          {translation('properties')}
        </MenuItem>
        <MenuItem onClick={() => router.push('/organizations')}>
          {translation('organizations')}
        </MenuItem>
        <MenuItem onClick={() => router.push('/invitations')}>
          {translation('invitations')}
        </MenuItem>
        <MenuItem
          className="text-negative hover:!bg-negative/20"
          onClick={() => signOut()}
        >
          {translation('signOut')}
        </MenuItem>
      </Menu>
    </div>
  )
}
