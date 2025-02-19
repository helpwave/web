import { tw } from '@twind/core';
import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { NavSidebar } from '@/components/layout/NavSidebar';
import type { HeaderProps } from '@/components/layout/Header';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Helpwave } from '@helpwave/common/icons/Helpwave';
import type { Languages } from '@helpwave/common/hooks/useLanguage';
import { useTranslation } from '@helpwave/common/hooks/useTranslation';
import { Menu } from 'lucide-react';

type PageTranslation = { customerPortal: string }

const defaultPageTranslationTranslation: Record<Languages, PageTranslation> = {
  en: {
    customerPortal: 'Customer Portal',
  },
  de: {
    customerPortal: 'Kunden Portal',
  }
}

export type PageProps = PropsWithChildren<{
  header?: HeaderProps,
  footer?: ReactNode,
}>

/**
 * Component for a page
 */
export const Page = ({
                       children,
                       header,
                       footer = (<Footer/>),
                     }: PageProps) => {
  const translation = useTranslation(defaultPageTranslationTranslation)
  const [isNavigationVisible, setIsNavigationVisible] = useState(false)

  const sideNav = (
    <NavSidebar
      items={[
        { name: { en: 'Dashboard', de: 'dashboard' }, url: '/' },
        { name: { en: 'Products', de: 'Produkte' }, url: '/products' },
        { name: { en: 'Bills', de: 'Rechnungen' }, url: '/bills' },
        { name: { en: 'Contact Information', de: 'Kontakt Informationen' }, url: '/contact-info' },
      ]}
      onHideClick={() => setIsNavigationVisible(false)}
    />
  )

  return (
    <div className={tw('relative flex flex-col w-screen h-screen')}>
      <Header
        leading={(
          <Link href="/" className={tw('flex flex-row gap-x-1 items-center text-2xl')}>
            <Helpwave/>
            <span className={tw('font-space font-bold')}>{`helpwave ${translation.customerPortal}`}</span>
          </Link>
        )}
        {...header}
        rightSide={[...header?.rightSide ?? [], (
          // TODO do aria here
          <button key="navOpen">
            <Menu className={tw('hidden mobile:block')} onClick={() => {
              setIsNavigationVisible(true)
            }}/>
          </button>
        ),
        ]}
      />
      {isNavigationVisible && (sideNav)}
      <div className={tw('flex flex-row w-full grow mobile:hidden')}>
        {sideNav}
        <div className={tw('flex flex-col')}>
          {children}
        </div>
      </div>
      <div className={tw('flex-col grow w-full @(hidden) mobile:flex')}>
        {children}
      </div>
      {footer}
    </div>
  )
}
