import { Span } from '@helpwave/common/components/Span'
import { tw } from '@helpwave/common/twind'
import type { PropsWithChildren } from 'react'

export type LabelProps = PropsWithChildren<{
  name: string,
  color?: string
}>;

/**
 * A component for labelling
 */
const Label = ({ name, color = 'hw-primary-400' }: LabelProps) => {
  return <Span className={tw(`rounded-full text-xs font-bold bg-${color}-background text-${color}-text py-1 px-2`)}>{name}</Span>
}

export { Label }
