import { Span } from '@helpwave/common/components/Span'
import { tx } from '@helpwave/common/twind'
import type { PropsWithChildren } from 'react'

type ColorTypes = 'label-1' | 'label-2' | 'label-3' | 'blue' | 'pink' // extended these colors for more variations

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
  return (
    <Span
      className={tx(`rounded-full text-xs font-bold py-1 px-2`, className, {
        'bg-hw-label-pink-background': color === 'pink',
        'text-hw-label-pink-text': color === 'pink',
        'bg-hw-label-blue-background': color === 'blue',
        'text-hw-label-blue-text': color === 'blue',
        'bg-hw-label-1-background': color === 'label-1',
        'text-hw-label-1-text': color === 'label-1',
        'bg-hw-label-2-background': color === 'label-2',
        'text-hw-label-2-text': color === 'label-2',
        'bg-hw-label-3-background': color === 'label-3',
        'text-hw-label-3-text': color === 'label-3',
      })}
    >
      {name}
    </Span>
  )
}

export { Label }
