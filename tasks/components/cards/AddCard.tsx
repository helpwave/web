import { tx, tw } from '@helpwave/common/twind'
import Add from '@helpwave/common/icons/Add'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import type { Class } from '@twind/core'

export type AddCardProps = CardProps & {
  text?: string,
  className?: Class[] | string
}

export const AddCard = ({
  text,
  isSelected,
  onTileClick = () => undefined,
  className
}: AddCardProps) => {
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tx('cursor-pointer', className)}>
      <div className={tw('flex flex-row justify-center items-center gap-x-1 text-gray-400 h-full')}>
        <Add/>
        {text && <span>{text}</span>}
      </div>
    </Card>
  )
}
