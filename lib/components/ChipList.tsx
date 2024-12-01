import type { HTMLProps, PropsWithChildren } from 'react'
import { tx } from '../twind'
import { getColoring } from '../coloring/util'
import type { AppColor } from '../twind/config'
import { appColorNames } from '../twind/config'

type ChipColorTypes = AppColor | 'darkPrimary' | 'lightPrimary' | 'black' // extended these colors for more variations

type ChipVariant = 'normal' | 'fullyRounded'

export type ChipProps = HTMLProps<HTMLDivElement> & PropsWithChildren< {
  color?: ChipColorTypes,
  variant?: ChipVariant
}>

/**
 * A component for displaying a single chip
 */
export const Chip = ({
  children,
  color,
  variant = 'normal',
  className = '',
  ...restProps
}: ChipProps) => {
  return (
    <div
      {...restProps}
      className={tx(
        'w-fit',
        {
          'bg-hw-primary-800 text-white': color === 'darkPrimary',
          'bg-hw-primary-200 text-hw-primary-800': color === 'lightPrimary',
          'bg-black text-white': color === 'black',
          [getColoring({ color: color! as AppColor, style: 'tonal-opaque' })]: appColorNames.some(value => value === color),
        },
        {
          'rounded-md px-2 py-1': variant === 'normal',
          'rounded-full text-xs font-bold px-2 py-1': variant === 'fullyRounded',
        },
        className
      )}
    >
      {children}
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
      {list.map((value, index) => (
        <Chip
          key={index}
          {...value}
          color={value.color ?? 'darkPrimary'}
          variant={value.variant ?? 'normal'}
        >
          {value.children}
        </Chip>
      ))}
    </div>
  )
}
