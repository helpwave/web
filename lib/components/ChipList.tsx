import type { ReactNode } from 'react'
import { tx } from '../twind'

type ChipColorTypes = 'label-1' | 'label-2' | 'label-3' | 'blue' | 'pink' | 'yellow'| 'darkPrimary'; // extended these colors for more variations

type ChipVariant = 'normal' | 'fullyRounded'

export type ChipProps = {
  label: ReactNode,
  color?: ChipColorTypes,
  variant?: ChipVariant,
  className?: string
}

/**
 * A component for displaying a single chip
 */
export const Chip = ({
  label,
  color,
  variant = 'normal',
  className = ''
}: ChipProps) => {
  return (
    <div
      className={tx(
        'w-fit',
        {
          'bg-hw-primary-800 text-white': color === 'darkPrimary',
          'bg-hw-label-pink-background text-hw-label-pink-text': color === 'pink',
          'bg-hw-label-blue-background text-hw-label-blue-text': color === 'blue',
          'bg-hw-label-yellow-background text-hw-label-yellow-text': color === 'yellow',
          'bg-hw-label-1-background text-hw-label-1-text': color === 'label-1',
          'bg-hw-label-2-background text-hw-label-2-text': color === 'label-2',
          'bg-hw-label-3-background text-hw-label-3-text': color === 'label-3',
        },
        {
          'rounded-md px-2 py-1': variant === 'normal',
          'rounded-full text-xs font-bold px-2 py-1': variant === 'fullyRounded',
        },
        className
      )}
    >
      {label}
    </div>
  )
}

export type ChipListProps = {
  list: ChipProps[],
  className?: string
}

/**
 * A component for displaying a list of chips
 */
export const ChipList = ({
  list,
  className = ''
}: ChipListProps) => {
  return (
    <div className={tx('flex flex-wrap gap-x-4 gap-y-2', className)}>
      {list.map((value, index) => <Chip key={index} label={value.label} color={value.color ?? 'darkPrimary'} variant={value.variant ?? 'normal'} className={value.className}/>)}
    </div>
  )
}
