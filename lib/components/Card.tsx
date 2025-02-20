import type { MouseEventHandler, PropsWithChildren } from 'react'
import type { Class } from '@twind/core'
import { tx } from '../twind'
import { noop } from '../util/noop'

export type CardProps = {
  isSelected?: boolean,
  onTileClick?: MouseEventHandler<HTMLDivElement> | undefined,
  className?: Class[] | string,
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
      className={tx(
        'rounded-md py-2 px-4 border border-2 w-full bg-white hover:border-hw-primary-800 cursor-pointer',
        { 'border-hw-primary-700': isSelected },
        className
      )}
    >
      {children}
    </div>
  )
}
