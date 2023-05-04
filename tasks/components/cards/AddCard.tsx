import { tx, tw } from '@helpwave/common/twind'
import { Plus } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import type { Class } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'

export type AddCardProps = CardProps & {
  text?: string,
  className?: Class[] | string
}

/**
 * A Card for adding something the text shown is configurable
 */
export const AddCard = ({
  text,
  isSelected,
  onTileClick = () => undefined,
  className
}: AddCardProps) => {
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tx('cursor-pointer', className)}>
      <div className={tw('flex flex-row justify-center items-center gap-x-1 text-gray-400 h-full')}>
        <Plus/>
        {text && <Span>{text}</Span>}
      </div>
    </Card>
  )
}
