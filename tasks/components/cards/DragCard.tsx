import { tx } from '@helpwave/common/twind'
import type { PropsWithChildren } from 'react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'

export type DragCardProps = PropsWithChildren<CardProps>

/**
 * A Card to use when items are dragged for uniform design
 */
export const DragCard = ({
  children,
  className,
  ...cardProps
}: DragCardProps) => {
  // For now fully equal to a normal card but, that might change later
  return (
    <Card className={tx(className, 'bg-white')} {...cardProps}>
      {children}
    </Card>
  )
}
