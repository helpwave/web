import { tw, tx } from '@twind/core'
import type { PropsWithChildren, ReactNode } from 'react'
import { useState } from 'react'
import type { NavItem } from '@/components/layout/NavigationSidebar'
import { NavigationSidebar } from '@/components/layout/NavigationSidebar'
import type { HeaderProps } from '@/components/layout/Header'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Menu } from 'lucide-react'
import Head from 'next/head'
import { MobileNavigationOverlay } from '@/components/layout/MobileNavigationOverlay'

type PageTranslation = { customer: string }

const defaultPageTranslationTranslation: Record<Languages, PageTranslation> = {
  en: {
    customer: 'customer',
  },
  de: {
    customer: 'customer',
  }
}

export type PageProps = PropsWithChildren<{
  pageTitle: string,
  header?: HeaderProps,
  footer?: ReactNode,
  mainContainerClassName?: string,
}>

const navItems: NavItem[] = [
  { name: { en: 'Dashboard', de: 'dashboard' }, url: '/' },
  { name: { en: 'Products', de: 'Produkte' }, url: '/products' },
  { name: { en: 'Invoices', de: 'Rechnungen' }, url: '/invoices' },
  { name: { en: 'Contact Information', de: 'Kontakt Informationen' }, url: '/contact-info' },
]

/**
 * Component for a page
 */
export const Page = ({
                       children,
                       pageTitle,
                       header,
                       footer = (<Footer/>),
                       mainContainerClassName,
                     }: PageProps) => {
  const translation = useTranslation(defaultPageTranslationTranslation)
  const [isNavigationVisible, setIsNavigationVisible] = useState(false)

  const mainContent = (
    <div className={tw('flex flex-col w-full h-full overflow-y-scroll')}>
      <main className={tx('@(flex flex-col max-h-[1200px] gap-y-6)', mainContainerClassName)}>
        {children}
      </main>
      {footer}
    </div>
  )

  return (
    <div className={tw('relative flex flex-col w-screen h-screen overflow-hidden')}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header
        leading={(
          <Link href="/" className={tw('flex flex-row gap-x-1 items-center text-2xl')}>
            <Helpwave/>
            <span className={tw('font-space font-bold')}>{`helpwave ${translation.customer}`}</span>
          </Link>
        )}
        {...header}
        rightSide={[...header?.rightSide ?? [], (
          // TODO do aria here
          <button key="navOpen" className={tw('not-mobile:hidden')}>
            <Menu onClick={() => {
              setIsNavigationVisible(true)
            }}/>
          </button>
        ),
        ]}
      />
      {isNavigationVisible && (
        <MobileNavigationOverlay items={navItems} onCloseClick={() => setIsNavigationVisible(false)}/>
      )}
      <div className={tw('flex flex-row w-full h-full grow mobile:hidden')}>
        {<NavigationSidebar items={navItems}/>}
        {mainContent}
      </div>
      <div className={tw('not-mobile:hidden w-full h-full')}>
        {mainContent}
      </div>
    </div>
  )
}
