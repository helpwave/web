import type { Languages } from '@helpwave/common/hooks/useLanguage';
import { useLanguage } from '@helpwave/common/hooks/useLanguage';
import { tx } from '@twind/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

export type NavItem = {
  name: Record<Languages, string>,
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

  return (
    <nav className={tx('@(flex flex-col h-full bg-gray-200 min-w-[200px] max-w-[200px] overflow-y-auto)', className)}>
      {items.map((item, i) => (
        <Link
          href={item.url}
          key={i}
          className={tx(
            'px-4 py-2 hover:bg-hw-primary-500/40 mobile:(w-[300px] text-xl font-semibold rounded-lg text-center)',
            { 'bg-hw-primary-500/30': router.pathname == item.url }
          )}
        >
          {item.name[language]}
        </Link>
      ))}
    </nav>
  )
}
