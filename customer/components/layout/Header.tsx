import type { ReactNode } from 'react'
import clsx from 'clsx'

export type HeaderProps = {
  leading?: ReactNode,
  leftSide?: ReactNode[],
  rightSide?: ReactNode[],
  className?: string,
}

/**
 * A header component
 */
export const Header = ({ leading, leftSide, rightSide, className }: HeaderProps) => {
  return (
    <header
      className={clsx(
        'sticky top-0 row items-center justify-between px-2 py-2 w-full min-h-[64px] max-h-[64px] shadow-md bg-white',
        className
      )}
    >
      <div className="row items-center gap-x-4">
        {leading}
        {leading && leftSide && (<div className="h-8 w-[2px] rounded bg-gray-200"/>)}
        {leftSide && (
          <div className="row items-center gap-x-2">
            {leftSide}
          </div>
        )}
      </div>
      {rightSide && (
        <div className="row items-center gap-x-2">
          {rightSide}
        </div>
      )}
    </header>
  )
}
