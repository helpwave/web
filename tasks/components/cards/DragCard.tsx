import type { PropsWithChildren } from 'react'
import { tx } from '@helpwave/style-themes/twind'
import { Card, type CardProps } from '@helpwave/common/components/Card'

export type CardDragProperties = {
  isDragging?: boolean,
  isOver?: boolean,
  isDangerous?: boolean,
  isInvalid?: boolean,
}

export type DragCardProps = PropsWithChildren<CardProps & {
  cardDragProperties?: CardDragProperties,
}>

/**
 * A Card to use when items are dragged for uniform design
 */
export const DragCard = ({
  children,
  cardDragProperties = {},
  isSelected,
  className,
  ...cardProps
}: DragCardProps) => {
  // For now fully equal to a normal card but, that might change later
  return (
    <Card className={tx(className, 'border-2', {
      'hover:border-hw-primary-800 cursor-pointer': !cardDragProperties.isDragging && !cardDragProperties.isOver, // default
      'border-hw-primary-700': isSelected,
      'cursor-grabbing': cardDragProperties.isDragging,
      'border-hw-warn-400 border-dashed': cardDragProperties.isOver && cardDragProperties.isDangerous,
      'border-hw-primary-700 border-dashed': cardDragProperties.isOver && !cardDragProperties.isDangerous && !cardDragProperties.isInvalid,
      'border-hw-negative-400': cardDragProperties.isOver && cardDragProperties.isInvalid,
    })} {...cardProps}>
      {children}
    </Card>
  )
}
