import Link from 'next/link'
import type { ReactNode } from 'react'
import { tw } from '@twind/core'
import HelpwaveLogo from '../icons/HelpwaveRect'

type HeaderProps = {
  title: string,
  navigation?: {
    text: string,
    href: string,
    active?: boolean
  }[],
  actions?: ReactNode[],
  /**
   * @default true
   */
  withIcon?: boolean
}

const Header = ({ title, navigation = [], actions = [], withIcon = true }: HeaderProps) => {
  return (
    <div className={tw('h-16 py-4 relative flex items-center justify-between border-b border-slate-900/10')}>
      <div className={tw('flex gap-4 w-full justify-between mx-4')}>
        <div className={tw('w-full relative flex items-center align-center')}>
          {withIcon ? (
            <div className={tw('relative flex gap-2 align-center')}>
              <HelpwaveLogo className={tw('mx-auto h-8 w-auto text-indigo-900')} />
              <span className={tw('text-xl font-medium text-indigo-900 leading-relaxed')}>{title}</span>
            </div>
          ) : null}
          <div className={tw('relative flex items-center ml-auto')}>
            <nav className={tw('text-sm text-slate-700 font-semibold align-center')}>
              <ul className={tw('flex space-x-8')}>
                {navigation.map((item) => (
                  <Link href={item.href} key={item.href} passHref className={tw('hover:text-indigo-500')}>{item.text}</Link>
                ))}
              </ul>
            </nav>
            <div className={tw('flex items-center border-l border-slate-200 ml-6 pl-6')}>
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Header }
