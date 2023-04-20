import type { ReactNode } from 'react'
import { tw } from '@helpwave/common/twind/index'
import HelpwaveLogo from '../icons/HelpwaveRect'
import { useRouter } from 'next/router'
import Link from 'next/link'

export type HeaderProps = {
  title?: string,
  leftSide?: ReactNode[],
  rightSide?: ReactNode[],
  /**
   * @default true
   */
  withIcon?: boolean
}

const Header = ({ title, leftSide = [], rightSide = [], withIcon = true }: HeaderProps) => {
  return (
    <div className={tw('h-16 py-4 relative flex items-center justify-between border-b border-slate-900/10')}>
      <div className={tw('flex gap-4 w-full justify-between mx-4')}>
        <div className={tw('w-full relative flex items-center align-center')}>
          {withIcon && (
            <div className={tw('relative flex gap-2 align-center')}>
              <Link href="/">
                <HelpwaveLogo className={tw('mx-auto h-8 w-auto')}/>
              </Link>
            </div>
          )}
          {title && <span className={tw('text-xl font-medium leading-relaxed')}>{title}</span>}
          {leftSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'leftAction' + index} className={tw('flex flex-row items-center')}>
              {(index !== 0 || title || withIcon) && <div className={tw('bg-gray-300 rounded h-8 w-0.5 mx-4')}/>}
              {value}
            </div>
          ))}
        </div>
        <div className={tw('w-full flex items-center justify-end')}>
          {rightSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'rightAction' + index} className={tw('flex flex-row items-center')}>
              {value}
              {index !== rightSide?.length - 1 && <div className={tw('bg-gray-300 rounded h-8 w-0.5 mx-3')}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Header }
