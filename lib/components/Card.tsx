import { tx } from '../twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'
import type { Class } from '@twind/core'

export type CardProps = {
  isSelected?: boolean,
  onTileClick?: MouseEventHandler<HTMLDivElement> | undefined,
  className?: Class[] | string
}

/**
 * A Card component with click call back
 */
export const Card = ({
  children,
  isSelected = false,
  onTileClick = () => undefined,
  className = '',
}: PropsWithChildren<CardProps>) => {
  return (
    <div onClick={onTileClick}
         className={tx('cursor-pointer rounded-md py-2 px-4 border border-2 hover:border-hw-primary-700 w-full', { 'border-hw-primary-700': isSelected }, className)}>
      {children}
    </div>
  )
}
