import { tw } from '@helpwave/common/twind'
import { Plus } from 'lucide-react'
import { Card, type CardProps } from '@helpwave/common/components/Card'
import { Span } from '@helpwave/common/components/Span'

export type AddCardProps = CardProps & {
  text?: string,
}

/**
 * A Card for adding something the text shown is configurable
 */
export const AddCard = ({
  text,
  ...cardProps
}: AddCardProps) => {
  return (
    <Card {...cardProps}>
      <div className={tw('flex flex-row justify-center items-center gap-x-1 text-gray-400 h-full')}>
        <Plus/>
        {text && <Span>{text}</Span>}
      </div>
    </Card>
  )
}
