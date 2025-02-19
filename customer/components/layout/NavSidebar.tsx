import type { Languages } from '@helpwave/common/hooks/useLanguage';
import { useLanguage } from '@helpwave/common/hooks/useLanguage';
import { tw, tx } from '@twind/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { noop } from '@helpwave/common/util/noop';
import { X } from 'lucide-react';

export type NavItem = {
  name: Record<Languages, string>,
  url: string,
  subItems?: NavItem[],
}

export type NavSidebarProps = {
  items: NavItem[],
  onHideClick?: () => void,
  className?: string,
}

/**
 * A navigation sidebar component
 */
export const NavSidebar = ({ items, onHideClick = noop, className }: NavSidebarProps) => {
  const { language } = useLanguage()
  const router = useRouter()
  return (
    <div className={tx('@(flex flex-col h-full bg-gray-200) mobile:(w-full top-0 absolute px-6 py-2 gap-y-8 items-center justify-center z-[100])', className)}>
      <button className={tw('hidden mobile:block')} onClick={onHideClick}><X size={64}/></button>
      {items.map((item, i) => (
        <Link
          href={item.url}
          key={i}
          className={tx('px-4 py-2 hover:bg-hw-primary-500/40 mobile:(w-[300px] text-xl font-semibold rounded-lg text-center)', { 'bg-hw-primary-500/30': router.pathname == item.url })}
        >
          {item.name[language]}
        </Link>
      ))}
    </div>
  )
}
