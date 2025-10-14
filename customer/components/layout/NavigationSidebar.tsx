import { languagesLocalNames } from '@helpwave/hightide'
import { useLanguage } from '@helpwave/hightide'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Avatar } from '@helpwave/hightide'
import { LanguageModal } from '@helpwave/hightide'
import { ArrowRightLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { SolidButton } from '@helpwave/hightide'
import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { OIDC_PROVIDER } from '@/api/config'

export type NavItem = {
  name: Translation<string>,
  icon?: ReactNode,
  url: string,
  isExternal?: boolean,
  subItems?: NavItem[],
}

export type NavSidebarProps = {
  items: NavItem[],
  className?: string,
}

type NavigationSidebarTranslation = {
  logout: string,
}

const defaultNavigationSidebarTranslation: Translation<NavigationSidebarTranslation> = {
  en: {
    logout: 'Logout'
  },
  de: {
    logout: 'Logout'
  },
}

/**
 * A navigation sidebar component
 */
export const NavigationSidebar = ({ items, className }: NavSidebarProps) => {
  const { language } = useLanguage()
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const router = useRouter()
  const translation = useTranslation(defaultNavigationSidebarTranslation)
  const { identity, logout } = useAuth()

  return (
    <div
      className={clsx(`col justify-between grow shadow-xl bg-gray-200 min-w-[250px] max-w-[250px]`, className)}>
      <LanguageModal
        id="language-modal"
        isOpen={isLanguageModalOpen}
        onCloseClick={() => setIsLanguageModalOpen(false)}
        onBackgroundClick={() => setIsLanguageModalOpen(false)}
        onDone={() => setIsLanguageModalOpen(false)}
      />
      <nav className="col overflow-y-auto">
        {items.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            target={item.isExternal ?? false ? '_blank' : undefined}
            className={clsx(
              'px-4 py-2 bg-gray-50 hover:bg-primary/40 flex flex-row gap-x-2 px-4 items-center',
              { 'bg-gray-200': router.pathname == item.url }
            )}
          >
            {item.icon}
            {item.name[language]}
          </Link>
        ))}
      </nav>
      <div className="col">
        <button
          className="row justify-between items-center px-4 py-2 bg-gray-50 hover:bg-primary/40"
          onClick={() => setIsLanguageModalOpen(true)}
        >
          {languagesLocalNames[language]}
          <ArrowRightLeft size={24}/>
        </button>
        <div className="col p-4 gap-y-4 bg-gray-50">
          <Link href={OIDC_PROVIDER + '/account'} target="_blank" className="row items-center">
            <Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>
            {identity?.profile?.name}
          </Link>
          <SolidButton onClick={logout} color="negative">{translation.logout}</SolidButton>
        </div>
      </div>
    </div>
  )
}
