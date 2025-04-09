import type { MouseEventHandler, PropsWithChildren } from 'react'
import { noop } from '../util/noop'
import clsx from 'clsx'

export type CardProps = {
  isSelected?: boolean,
  onTileClick?: MouseEventHandler<HTMLDivElement> | undefined,
  className?: string,
}

/**
 * A Card component with click call back
 */
export const Card = ({
  children,
  isSelected = false,
  onTileClick = noop,
  className = '',
}: PropsWithChildren<CardProps>) => {
  return (
    <div onClick={onTileClick}
      className={clsx(
        '@(rounded-md py-2 px-4 border border-2 w-full bg-white hover:border-hw-primary-800 cursor-pointer)',
        { '@(border-hw-primary-700)': isSelected },
        className
      )}
    >
      {children}
    </div>
  )
}
