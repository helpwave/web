import type { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Helpwave } from '@helpwave/common/components/icons/Helpwave'

export type HeaderProps = {
  title?: string,
  leftSide?: ReactNode[],
  rightSide?: ReactNode[],
  /**
   * @default true
   */
  withIcon?: boolean,
}

/**
 * The basic header for most pages
 *
 * Structure:
 *
 * Logo Title | left <space> right
 *
 * each element in left and right is also seperated by the divider
 */
const Header = ({ title, leftSide = [], rightSide = [], withIcon = true }: HeaderProps) => {
  return (
    <div className={clsx('h-16 py-4 relative items-center justify-between border-b border-slate-900/10')}>
      <div className={clsx('gap-4 w-full justify-between mx-4')}>
        <div className={clsx('w-full relative items-center align-center')}>
          {withIcon && (
            <div className={clsx('relative gap-2 align-center')}>
              <Link href="/">
                <Helpwave size={52} />
              </Link>
            </div>
          )}
          {title && <span className={clsx('textstyle-title-md')}>{title}</span>}
          {leftSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'leftAction' + index} className={clsx('row items-center')}>
              {(index !== 0 || title || withIcon) && <div className={clsx('bg-gray-300 rounded h-8 w-0.5 mx-4')}/>}
              {value}
            </div>
          ))}
        </div>
        <div className={clsx('w-full items-center justify-end')}>
          {rightSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'rightAction' + index} className={clsx('row items-center')}>
              {value}
              {index !== rightSide?.length - 1 && <div className={clsx('bg-gray-300 rounded h-8 w-0.5 mx-3')}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Header }
