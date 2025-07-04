import type { ReactNode } from 'react'
import Link from 'next/link'
import { Helpwave } from '@helpwave/hightide'
import clsx from 'clsx'

export type HeaderProps = {
  title?: string,
  leftSide?: ReactNode[],
  leftSideClassName?: string,
  rightSide?: ReactNode[],
  rightSideClassName?: string,
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
const Header = ({
                  title,
                  leftSide = [],
                  leftSideClassName,
                  rightSide = [],
                  rightSideClassName,
                  withIcon = true
                }: HeaderProps) => {
  return (
    <div className="row h-16 py-4 relative items-center justify-between bg-header-background text-header-text shadow-md">
      <div className="row w-full gap-x-8 justify-between mx-4">
        <div className="row relative items-center align-center">
          {withIcon && (
            <div className="row relative align-center">
              <Link href="/">
                <Helpwave size={52}/>
              </Link>
            </div>
          )}
          {title && <span className="textstyle-title-md">{title}</span>}
          {leftSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'leftAction' + index} className={clsx('row items-center', leftSideClassName)}>
              {(index !== 0 || title || withIcon) && <div className="bg-gray-300 rounded h-8 w-0.5 mx-4"/>}
              {value}
            </div>
          ))}
        </div>
        <div className="row items-center justify-end">
          {rightSide?.filter(value => value !== undefined).map((value, index) => (
            <div key={'rightAction' + index} className={clsx('row items-center', rightSideClassName)}>
              {value}
              {index !== rightSide?.length - 1 && <div className="bg-gray-300 rounded h-8 w-0.5 mx-3"/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Header }
