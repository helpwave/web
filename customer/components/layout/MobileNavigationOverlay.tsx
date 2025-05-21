import type { Languages } from '@helpwave/hightide'
import { languagesLocalNames } from '@helpwave/hightide'
import { useLanguage } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { noop } from '@helpwave/hightide'
import { ArrowRightIcon, ArrowRightLeft, X } from 'lucide-react'
import { useTranslation } from '@helpwave/hightide'
import type { NavItem } from '@/components/layout/NavigationSidebar'
import { Avatar } from '@helpwave/hightide'
import { LanguageModal } from '@helpwave/hightide'
import { useState } from 'react'
import { logout } from '@/api/auth/authService'
import clsx from 'clsx'
import { SolidButton } from '@helpwave/hightide'

type MobileNavigationOverlayTranslation = { navigation: string, logout: string }

const defaultMobileNavigationOverlayTranslation: Record<Languages, MobileNavigationOverlayTranslation> = {
  en: {
    navigation: 'Navigation',
    logout: 'Logout'

  },
  de: {
    navigation: 'Navigation',
    logout: 'Logout',
  }
}

export type MobileNavigationOverlayProps = {
  items: NavItem[],
  onCloseClick?: () => void,
  className?: string,
}

/**
 * A navigation component that overlays the entire screen
 *
 * ONLY use on mobile screen sizes
 */
export const MobileNavigationOverlay = ({ items, onCloseClick = noop, className }: MobileNavigationOverlayProps) => {
  const { language } = useLanguage()
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const translation = useTranslation(defaultMobileNavigationOverlayTranslation)
  const router = useRouter()

  return (
    <div
      className="col bg-white h-full w-full top-0 absolute px-8 py-6 z-[100] tablet:hidden justify-between">
      <LanguageModal
        id="language-modal-mobile"
        isOpen={isLanguageModalOpen}
        onCloseClick={() => setIsLanguageModalOpen(false)}
        onBackgroundClick={() => setIsLanguageModalOpen(false)}
        onDone={() => setIsLanguageModalOpen(false)}
        containerClassName="z-[102]"
      />
      <nav className={clsx('col gap-y-4 items-center', className)}>
        <div className="row w-full items-center justify-between mb-2">
          <h2 className="font-bold font-space text-2xl">{translation.navigation}</h2>
          <button className="rounded-md p-1" onClick={onCloseClick}>
            <X size={24}/>
          </button>
        </div>
        {items.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            target={item.isExternal ?? false ? '_blank' : undefined}
            className={clsx(
              'flex flex-row justify-between items-center px-4 py-2 hover:bg-primary/40 hover:text-on-primary w-full text-lg font-semibold rounded-md',
              { 'bg-gray-100': router.pathname === item.url, 'bg-white': router.pathname !== item.url }
            )}
          >
            <div className="row gap-x-2 items-center">
              {item.icon}
              {item.name[language]}
            </div>
            <ArrowRightIcon size={24}/>
          </Link>
        ))}
      </nav>
      <div className="col gap-y-4 items-center w-full">
        <button
          className="row w-full justify-between items-center px-4 py-2 bg-gray-100 hover:bg-hw-primary-500/40 font-semibold rounded-md"
          onClick={() => setIsLanguageModalOpen(true)}
        >
          {languagesLocalNames[language]}
          <ArrowRightLeft size={24}/>
        </button>
        <button
          className="row w-full items-center p-4 bg-white bg-gray-100 hover:bg-hw-primary-500/40 font-semibold rounded-md">
          <Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>
          {'Max Mustermann'}
        </button>
        <SolidButton onClick={logout} color="negative">{translation.logout}</SolidButton>
      </div>
    </div>
  )
}
