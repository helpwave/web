import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { languagesLocalNames } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { tw, tx } from '@twind/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { noop } from '@helpwave/common/util/noop'
import { ArrowRightIcon, ArrowRightLeft, X } from 'lucide-react'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { NavItem } from '@/components/layout/NavigationSidebar'
import { Avatar } from '@helpwave/common/components/Avatar'
import { LanguageModal } from '@helpwave/common/components/modals/LanguageModal'
import { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'
import { logout } from '@/api/auth/authService'

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
      className={tw('@(flex flex-col bg-white h-full w-full top-0 absolute px-8 py-6 z-[100] not-mobile:hidden justify-between)')}>
      <LanguageModal
        id="language-modal-mobile"
        isOpen={isLanguageModalOpen}
        onCloseClick={() => setIsLanguageModalOpen(false)}
        onBackgroundClick={() => setIsLanguageModalOpen(false)}
        onDone={() => setIsLanguageModalOpen(false)}
        containerClassName={tw('z-[102]')}
      />
      <nav className={tx('@(flex flex-col gap-y-4 items-center)', className)}>
        <div className={tw('flex flex-row w-full items-center justify-between mb-2')}>
          <h2 className={tw('font-bold font-space text-2xl')}>{translation.navigation}</h2>
          <button className={tw('rounded-md p-1')} onClick={onCloseClick}>
            <X size={24}/>
          </button>
        </div>
        {items.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            target={item.isExternal ?? false ? '_blank' : undefined}
            className={tx(
              'flex flex-row justify-between items-center px-4 py-2 hover:bg-hw-primary-500/40 w-full text-lg font-semibold rounded-md',
              { 'bg-gray-100': router.pathname === item.url, 'bg-white': router.pathname !== item.url }
            )}
          >
            <div className={tw('flex flex-row gap-x-2 items-center')}>
              {item.icon}
              {item.name[language]}
            </div>
            <ArrowRightIcon size={24}/>
          </Link>
        ))}
      </nav>
      <div className={tw('flex flex-col gap-y-4 items-center w-full')}>
        <button
          className={tw('flex flex-row w-full justify-between items-center px-4 py-2 bg-gray-100 hover:bg-hw-primary-500/40 font-semibold rounded-md')}
          onClick={() => setIsLanguageModalOpen(true)}
        >
          {languagesLocalNames[language]}
          <ArrowRightLeft size={24}/>
        </button>
        <button
          className={tw('flex flex-row w-full gap-x-2 items-center p-4 bg-white bg-gray-100 hover:bg-hw-primary-500/40 font-semibold rounded-md')}>
          <Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>
          {'Max Mustermann'}
        </button>
        <Button onClick={logout} color="hw-negative">{translation.logout}</Button>
      </div>
    </div>
  )
}
