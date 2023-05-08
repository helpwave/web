import { Span } from '@helpwave/common/components/Span'
import { tw } from '@helpwave/common/twind'
import type { PropsWithChildren } from 'react'

export type LabelProps = PropsWithChildren<{
  name: string,
  color?: 'hw-label-1' | 'hw-label-2' | 'hw-label-3' | 'hw-label-blue' | 'hw-label-pink' // extended these colors for more variations
}>;

/**
 * A component for labelling
 */
const Label = ({ name, color = 'hw-label-blue' }: LabelProps) => {
  return <Span className={tw(`rounded-full text-xs font-bold bg-${color}-background text-${color}-text py-1 px-2`)}>{name}</Span>
}

export { Label }
