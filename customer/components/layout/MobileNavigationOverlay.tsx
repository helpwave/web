import type { Languages } from '@helpwave/common/hooks/useLanguage';
import { useLanguage } from '@helpwave/common/hooks/useLanguage';
import { tw, tx } from '@twind/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { noop } from '@helpwave/common/util/noop';
import { ArrowRightIcon, X } from 'lucide-react';
import { useTranslation } from '@helpwave/common/hooks/useTranslation';

type MobileNavigationOverlayTranslation = { navigation: string }

const defaultMobileNavigationOverlayTranslation: Record<Languages, MobileNavigationOverlayTranslation> = {
  en: {
    navigation: 'Navigation',
  },
  de: {
    navigation: 'Navigation',
  }
}

export type NavItem = {
  name: Record<Languages, string>,
  url: string,
  subItems?: NavItem[],
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
  const translation = useTranslation(defaultMobileNavigationOverlayTranslation)
  const router = useRouter()

  return (
    <nav className={tx('@(flex flex-col bg-gray-200 h-full w-full top-0 absolute px-8 py-6 gap-y-4 items-center z-[100] not-mobile:hidden)', className)}>
      <div className={tw('flex flex-row w-full items-center justify-between mb-2')}>
        <h2 className={tw('font-bold font-space text-2xl')}>{translation.navigation}</h2>
        <button className={tw('rounded-md bg-gray-300 hover:bg-gray-400 p-1')} onClick={onCloseClick}>
          <X size={24}/>
        </button>
      </div>
      {items.map((item, i) => (
        <Link
          href={item.url}
          key={i}
          className={tx(
            'flex flex-row justify-between items-center px-4 py-2 hover:bg-hw-primary-500/40 w-full text-lg font-semibold rounded-md',
            { 'bg-hw-primary-500/30': router.pathname === item.url, 'bg-white': router.pathname !== item.url }
          )}
        >
          {item.name[language]}
          <ArrowRightIcon size={24}/>
        </Link>
      ))}
    </nav>
  )
}
