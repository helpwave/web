import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { languagesLocalNames } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { noop } from '@helpwave/common/util/noop'
import { ArrowRightIcon, ArrowRightLeft, X } from 'lucide-react'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { NavItem } from '@/components/layout/NavigationSidebar'
import { Avatar } from '@helpwave/common/components/Avatar'
import { LanguageModal } from '@helpwave/common/components/modals/LanguageModal'
import { useState } from 'react'

type MobileNavigationOverlayTranslation = { navigation: string }

const defaultMobileNavigationOverlayTranslation: Record<Languages, MobileNavigationOverlayTranslation> = {
  en: {
    navigation: 'Navigation',
  },
  de: {
    navigation: 'Navigation',
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
      className={clsx('col bg-gray-200 h-full w-full top-0 absolute px-8 py-6 z-[100] not-max-tablet:hidden justify-between')}>
      <LanguageModal
        id="language-modal-mobile"
        isOpen={isLanguageModalOpen}
        onCloseClick={() => setIsLanguageModalOpen(false)}
        onBackgroundClick={() => setIsLanguageModalOpen(false)}
        onDone={() => setIsLanguageModalOpen(false)}
        containerClassName={clsx('z-[102]')}
      />
      <nav className={clsx('col gap-y-4 items-center', className)}>
        <div className={clsx('row w-full items-center justify-between mb-2')}>
          <h2 className={clsx('font-bold font-space text-2xl')}>{translation.navigation}</h2>
          <button className={clsx('rounded-md bg-gray-300 hover:bg-gray-400 p-1')} onClick={onCloseClick}>
            <X size={24}/>
          </button>
        </div>
        {items.map((item, i) => (
          <Link
            href={item.url}
            key={i}
            className={clsx(
              'row justify-between items-center px-4 py-2 hover:bg-primary/40 w-full text-lg font-semibold rounded-md',
              { 'bg-primary/30': router.pathname === item.url, 'bg-white': router.pathname !== item.url }
            )}
          >
            <div className={clsx('row gap-x-2 items-center')}>
              {item.icon}
              {item.name[language]}
            </div>
            <ArrowRightIcon size={24}/>
          </Link>
        ))}
      </nav>
      <div className={clsx('col gap-y-4 items-center w-full')}>
        <button
          className={clsx('row w-full justify-between items-center px-4 py-2 bg-gray-50 hover:bg-primary/40 font-semibold rounded-md')}
          onClick={() => setIsLanguageModalOpen(true)}
        >
          {languagesLocalNames[language]}
          <ArrowRightLeft size={24}/>
        </button>
        <button className={clsx('row w-full items-center p-4 bg-gray-50 hover:bg-primary/40 font-semibold rounded-md')}>
          <Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>
          {'Max Mustermann'}
        </button>
      </div>
    </div>
  )
}
