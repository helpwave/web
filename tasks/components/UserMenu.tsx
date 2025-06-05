import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Languages, ThemeTypeTranslation ,
  ThemeType } from '@helpwave/hightide'
import {
  Avatar,
  defaultThemeTypeTranslation,
  LanguageModal,
  Menu,
  MenuItem,
  Modal,
  type PropsForTranslation,
  Select,
  useTheme,
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
} & ThemeTypeTranslation

const defaultUserMenuTranslations: Record<Languages, UserMenuTranslation> = {
  en: {
    profile: 'Profile',
    language: 'Language',
    signOut: 'Sign Out',
    taskTemplates: 'Task Templates',
    invitations: 'Invitations',
    organizations: 'Organizations',
    properties: 'Properties',
    theme: 'Theme',
    ...defaultThemeTypeTranslation.en,
  },
  de: {
    profile: 'Profil',
    language: 'Sprache',
    signOut: 'Ausloggen',
    taskTemplates: 'Vorlagen',
    invitations: 'Einladungen',
    organizations: 'Organisationen',
    properties: 'Properties',
    theme: 'Hell/Dunkel',
    ...defaultThemeTypeTranslation.de,
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
  const translation = useTranslation(defaultUserMenuTranslations, overwriteTranslation)
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false)
  const [isThemeModalOpen, setThemeModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const allowedThemes : ThemeType[] = ['light', 'dark']
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return (<div></div>)

  // The settings path "/ui/settings" is hardcoded. It depends strongly on the implementation of the Ory UI.
  const settingsURL = `${config.oauth.issuerUrl}/ui/settings`

  return (
    <div className={clsx('row relative z-10', className)}>
      <LanguageModal
        id="userMenu-LanguageModal"
        onDone={() => setLanguageModalOpen(false)}
        onBackgroundClick={() => setLanguageModalOpen(false)}
        onCloseClick={() => setLanguageModalOpen(false)}
        isOpen={isLanguageModalOpen}
      />
      <Modal
        id="themeModal"
        isOpen={isThemeModalOpen}
        onBackgroundClick={() => setThemeModalOpen(false)}
        onCloseClick={() => setThemeModalOpen(false)}
        titleText={translation.theme}
      >
        <Select<ThemeType>
          value={theme}
          onChange={setTheme}
          options={allowedThemes.map(value => ({
            label: translation[value],
            value
          }))}
        />
      </Modal>
      <Menu<HTMLDivElement> alignment="_r" trigger={(onClick, ref) => (
        <div ref={ref} onClick={onClick}
             className="row relative items-center group cursor-pointer select-none">
          {/* TODO set this color in the css config */}
          <div className="text-sm font-semibold text-gray-700 group-hover:text-primary">{user.name}</div>
          <Avatar avatarUrl={user.avatarUrl} alt={user.email} size="small"/>
        </div>
      )}>
        <Link href={settingsURL} target="_blank"><MenuItem alignment="left">{translation.profile}</MenuItem></Link>
        <MenuItem
          alignment="left" onClick={() => setLanguageModalOpen(true)}>
          {translation.language}
        </MenuItem>
        <MenuItem
          alignment="left" onClick={() => setThemeModalOpen(true)}>
          {translation.theme}
        </MenuItem>
        <MenuItem
          alignment="left" className="cursor-pointer"
          onClick={() => router.push('/templates')}
        >
          {translation.taskTemplates}
        </MenuItem>
        <MenuItem
          alignment="left" className="cursor-pointer"
          onClick={() => router.push('/properties')}
        >
          {translation.properties}
        </MenuItem>
        <MenuItem
          alignment="left" className="cursor-pointer"
          onClick={() => router.push('/organizations')}
        >
          {translation.organizations}
        </MenuItem>
        <MenuItem
          alignment="left" className="cursor-pointer"
          onClick={() => router.push('/invitations')}
        >
          {translation.invitations}
        </MenuItem>
        <MenuItem
          alignment="left" className="text-negative cursor-pointer"
          onClick={() => signOut()}
        >
          {translation.signOut}
        </MenuItem>
      </Menu>
    </div>
  )
}
