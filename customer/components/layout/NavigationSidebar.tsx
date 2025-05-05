import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { languagesLocalNames } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Avatar } from '@helpwave/common/components/Avatar'
import { LanguageModal } from '@helpwave/common/components/modals/LanguageModal'
import { ArrowRightLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { SolidButton } from '@helpwave/common/components/Button'
import type { Translation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

export type NavItem = {
  name: Record<Languages, string>,
  icon?: ReactNode,
  url: string,
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
      className={clsx(`col justify-between grow bg-gray-200 min-w-[250px] max-w-[250px]`, className)}>
      <LanguageModal
        id="language-modal"
        isOpen={isLanguageModalOpen}
        onCloseClick={() => setIsLanguageModalOpen(false)}
        onBackgroundClick={() => setIsLanguageModalOpen(false)}
        onDone={() => setIsLanguageModalOpen(false)}
      />
      <nav className={clsx('col overflow-y-auto')}>
        {items.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            className={clsx(
              'px-4 py-2 bg-gray-50 hover:bg-primary/40 row gap-x-2 items-center',
              { 'bg-primary/30': router.pathname == item.url }
            )}
          >
            {item.icon}
            {item.name[language]}
          </Link>
        ))}
      </nav>
      <div className={clsx('col')}>
        <button
          className={clsx('row justify-between items-center px-4 py-2 bg-gray-50 hover:bg-primary/40')}
          onClick={() => setIsLanguageModalOpen(true)}
        >
          {languagesLocalNames[language]}
          <ArrowRightLeft size={24}/>
        </button>
        <div className={clsx('col p-4 gap-y-4 bg-gray-50')}>
          <div className={clsx('row gap-x-2 items-center')}>
            <Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>
            {identity?.name}
          </div>
          <SolidButton onClick={logout} color="negative">{translation.logout}</SolidButton>
        </div>
      </div>
    </div>
  )
}
