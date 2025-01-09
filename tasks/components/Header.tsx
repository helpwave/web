import type { ReactNode } from 'react'
import Link from 'next/link'
import { tw } from '@helpwave/common/twind'
import { Helpwave } from '@helpwave/common/icons/Helpwave'

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
    <div className={tw('h-16 py-4 relative flex items-center justify-between border-b border-slate-900/10')}>
      <div className={tw('flex gap-4 w-full justify-between mx-4')}>
        <div className={tw('w-full relative flex items-center align-center')}>
          {withIcon && (
            <div className={tw('relative flex gap-2 align-center')}>
              <Link href="/">
                <Helpwave size={52} />
              </Link>
            </div>
          )}
          {title && <span className={tw('textstyle-title-md')}>{title}</span>}
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
