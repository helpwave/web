import type { MouseEventHandler, PropsWithChildren } from 'react'
import clsx from 'clsx'

export type CardDragProperties = {
  isDragging?: boolean,
  isOver?: boolean,
  isDangerous?: boolean,
  isInvalid?: boolean,
}

export type DragCardProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLDivElement>,
  isSelected?: boolean,
  cardDragProperties?: CardDragProperties,
  className?: string,
}>

/**
 * A Card to use when items are dragged for uniform design
 */
export const DragCard = ({
  children,
  cardDragProperties = {},
  isSelected,
  onClick,
  className,
}: DragCardProps) => {
  return (
    <div className={clsx('card-md border-2', {
      'hover:brightness-95 border-transparent hover:border-primary cursor-pointer': !cardDragProperties.isDragging && !cardDragProperties.isOver, // default
      'border-primary': isSelected,
      'cursor-grabbing': cardDragProperties.isDragging,
      'border-warning border-dashed': cardDragProperties.isOver && cardDragProperties.isDangerous,
      'border-primary border-dashed': cardDragProperties.isOver && !cardDragProperties.isDangerous && !cardDragProperties.isInvalid,
      'border-negative': cardDragProperties.isOver && cardDragProperties.isInvalid,
    }, className)} onClick={onClick}>
      {children}
    </div>
  )
}
