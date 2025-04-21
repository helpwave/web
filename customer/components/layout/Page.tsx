import { tw, tx } from '@twind/core'
import type { PropsWithChildren, ReactNode } from 'react'
import { useState } from 'react'
import type { NavItem } from '@/components/layout/NavigationSidebar'
import { NavigationSidebar } from '@/components/layout/NavigationSidebar'
import type { HeaderProps } from '@/components/layout/Header'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Menu, Package, Receipt, Settings } from 'lucide-react'
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
  isHidingSidebar?: boolean,
  mainContainerClassName?: string,
  contentAndFooterClassName?: string,
}>

const navItems: NavItem[] = [
  // { name: { en: 'Dashboard', de: 'Dashboard' }, url: '/', icon: (<GaugeIcon size={24}/>) },
  // { name: { en: 'Team', de: 'Team' }, url: '/team', icon: (<UsersIcon size={24}/>) },
  { name: { en: 'Products', de: 'Produkte' }, url: '/products', icon: (<Package size={24}/>) },
  { name: { en: 'Invoices', de: 'Rechnungen' }, url: '/invoices', icon: (<Receipt size={24}/>) },
  { name: { en: 'Settings', de: 'Einstellungen' }, url: '/settings', icon: (<Settings size={24}/>) },
]

/**
 * Component for a page
 */
export const Page = ({
                       children,
                       pageTitle,
                       header,
                       footer = (<></>),
                       isHidingSidebar = false,
                       mainContainerClassName,
                       contentAndFooterClassName,
                     }: PageProps) => {
  const translation = useTranslation(defaultPageTranslationTranslation)
  const [isNavigationVisible, setIsNavigationVisible] = useState(false)

  const mainContent = (
    <div className={tx('flex flex-col justify-between w-full h-full overflow-y-auto', contentAndFooterClassName)}>
      <main className={tx('@(flex flex-col gap-y-6)', mainContainerClassName)}>
        {children}
      </main>
      {footer}
    </div>
  )

  return (
    <div
      className={tw('relative not-mobile:(grid grid-rows-[auto_1fr]) mobile:(flex flex-col) w-screen h-screen overflow-hidden')}>
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
        rightSide={[...header?.rightSide ?? [], (!isHidingSidebar && (
          // TODO do aria here
          <button key="navOpen" className={tw('not-mobile:hidden')}>
            <Menu onClick={() => {
              setIsNavigationVisible(true)
            }}/>
          </button>
        )),
        ]}
      />
      {isNavigationVisible && !isHidingSidebar && (
        <MobileNavigationOverlay items={navItems} onCloseClick={() => setIsNavigationVisible(false)}/>
      )}
      <div className={tw('flex flex-row grow mobile:hidden overflow-hidden')}>
        {!isHidingSidebar && (<NavigationSidebar items={navItems}/>)}
        {mainContent}
      </div>
      <div className={tw('flex flex-col grow w-full not-mobile:hidden overflow-hidden')}>
        {mainContent}
      </div>
    </div>
  )
}
