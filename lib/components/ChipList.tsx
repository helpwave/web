import type { ReactNode } from 'react'
import { tx } from '../twind'

export type ChipProps = {
  label: ReactNode,
  className?: string
}

/**
 * A component for displaying a single chip
 */
export const Chip = ({
  label,
  className = ''
}: ChipProps) => {
  return (
    <div className={tx('rounded-md bg-hw-primary-800 text-white px-2 py-1 w-fit', className)}>
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
      {list.map((value, index) => <Chip key={index} label={value.label} className={value.className}/>)}
    </div>
  )
}
