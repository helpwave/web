import Link from 'next/link'
import type { ReactNode } from 'react'
import HelpwaveLogo from '../icons/Helpwave'

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
    <div className="h-16 py-4 relative flex items-center justify-between border-b border-slate-900/10">
      <div className="flex gap-4 w-full justify-between mx-4">
        <div className="w-full relative flex items-center align-center">
          {withIcon ? (
            <div className="relative flex gap-2 align-center">
              <HelpwaveLogo className="mx-auto h-8 w-auto text-indigo-900" />
              <span className="text-xl font-medium text-indigo-900 leading-relaxed">{title}</span>
            </div>
          ) : null}
          <div className="relative flex items-center ml-auto">
            <nav className="text-sm text-slate-700 font-semibold align-center">
              <ul className="flex space-x-8">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.href} passHref className="hover:text-indigo-500">{item.text}</Link>
                ))}
              </ul>
            </nav>
            <div className="flex items-center border-l border-slate-200 ml-6 pl-6">
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Header }
