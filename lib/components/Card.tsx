import { tx } from '../twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'
import type { Class } from '@twind/core'
import { noop } from '../util/noop'

export type CardDragProperties = {
  isDragging?: boolean,
  isOver?: boolean,
  isDangerous?: boolean,
  isInvalid?: boolean
}

export type CardProps = {
  isSelected?: boolean,
  cardDragProperties?: CardDragProperties,
  onTileClick?: MouseEventHandler<HTMLDivElement> | undefined,
  className?: Class[] | string
}

/**
 * A Card component with click call back
 */
export const Card = ({
  children,
  isSelected = false,
  cardDragProperties = {},
  onTileClick = noop(),
  className = '',
}: PropsWithChildren<CardProps>) => {
  return (
    <div onClick={onTileClick}
         className={tx('rounded-md py-2 px-4 border border-2 w-full bg-white', {
           'hover:border-hw-primary-800 cursor-pointer': !cardDragProperties.isDragging && !cardDragProperties.isOver, // default
           'border-hw-primary-700': isSelected,
           'cursor-grabbing': cardDragProperties.isDragging,
           'border-hw-warn-400 border-dashed': cardDragProperties.isOver && cardDragProperties.isDangerous,
           'border-hw-primary-700 border-dashed': cardDragProperties.isOver && !cardDragProperties.isDangerous && !cardDragProperties.isInvalid,
           'border-hw-negative-400': cardDragProperties.isOver && cardDragProperties.isInvalid,
         }, className)}
    >
      {children}
    </div>
  )
}
