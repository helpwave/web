import type { PropsWithChildren } from 'react'
import { tx } from '@helpwave/common/twind'
import { Card, type CardProps } from '@helpwave/common/components/Card'

export type DragCardStyle = {
  normal: string,
  selected: string,
  dragged: string,
  dragOverNormal: string,
  dragOverDangerous: string,
  dragOverInvalid: string
}

const defaultDragCardStyle: DragCardStyle = {
  normal: 'hover:border-hw-primary-800',
  selected: 'border-hw-primary-700',
  dragged: '',
  dragOverDangerous: 'border-hw-warn-400 border-dashed',
  dragOverNormal: 'border-hw-primary-700 border-dashed',
  dragOverInvalid: 'border-hw-negative-400'
}

export type CardDragProperties = {
  isDragging?: boolean,
  isOver?: boolean,
  isDangerous?: boolean,
  isInvalid?: boolean,
  styleOverwrite?: Partial<DragCardStyle>
}

export type DragCardProps = PropsWithChildren<CardProps & {
  cardDragProperties?: CardDragProperties
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
  const style: DragCardStyle = { ...cardDragProperties?.styleOverwrite, ...defaultDragCardStyle }

  // For now fully equal to a normal card but, that might change later
  return (
    <Card className={tx(className, 'border-2', {
      [`${style.normal} cursor-pointer`]: !cardDragProperties.isDragging && !cardDragProperties.isOver, // default
      [style.selected]: isSelected,
      [`cursor-grabbing ${style.dragged}`]: cardDragProperties.isDragging,
      [style.dragOverDangerous]: cardDragProperties.isOver && cardDragProperties.isDangerous,
      [style.dragOverNormal]: cardDragProperties.isOver && !cardDragProperties.isDangerous && !cardDragProperties.isInvalid,
      [style.dragOverInvalid]: cardDragProperties.isOver && cardDragProperties.isInvalid,
    })} {...cardProps}>
      {children}
    </Card>
  )
}
