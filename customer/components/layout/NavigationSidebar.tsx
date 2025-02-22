import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { tx } from '@twind/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { ReactNode } from 'react'

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

/**
 * A navigation sidebar component
 */
export const NavigationSidebar = ({ items, className }: NavSidebarProps) => {
  const { language } = useLanguage()
  const router = useRouter()

  const width = 250

  return (
    <nav className={tx(`@(flex flex-col h-full bg-gray-100 min-w-[${width}px] max-w-[${width}px] overflow-y-auto)`, className)}>
      {items.map((item, i) => (
        <Link
          href={item.url}
          key={i}
          className={tx(
            'px-4 py-2 hover:bg-hw-primary-500/40 flex flex-row gap-x-2 items-center',
            { 'bg-hw-primary-500/30': router.pathname == item.url }
          )}
        >
          {item.icon}
          {item.name[language]}
        </Link>
      ))}
    </nav>
  )
}
