import type { PropsWithChildren } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { tx } from '@helpwave/common/twind'

type ColorTypes = 'label-1' | 'label-2' | 'label-3' | 'blue' | 'pink' | 'yellow'; // extended these colors for more variations

export type LabelProps = PropsWithChildren<{
  name: string,
  color?: ColorTypes,
  className?: string
}>;

/**
 * A component for labelling
 */
const Label = ({
  name,
  color = 'label-1',
  className = undefined,
}: LabelProps) => {
  // The div stops the span from expanding
  return (
    <div>
      <Span
        className={tx(`rounded-full text-xs font-bold py-1 px-2`, className, {
          'bg-hw-label-pink-background text-hw-label-pink-text': color === 'pink',
          'bg-hw-label-blue-background text-hw-label-blue-text': color === 'blue',
          'bg-hw-label-yellow-background text-hw-label-yellow-text': color === 'yellow',
          'bg-hw-label-1-background text-hw-label-1-text': color === 'label-1',
          'bg-hw-label-2-background text-hw-label-2-text': color === 'label-2',
          'bg-hw-label-3-background text-hw-label-3-text': color === 'label-3',
        })}
      >
        {name}
      </Span>
    </div>
  )
}

export { Label }
