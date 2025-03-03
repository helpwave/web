import type { HTMLProps, PropsWithChildren, ReactNode } from 'react'
import { tw, tx } from '@helpwave/color-themes/twind'
import type { ChipColor } from '@helpwave/color-themes/twind/theme-variables'

type ChipVariant = 'normal' | 'fullyRounded'

export type ChipProps = HTMLProps<HTMLDivElement> & PropsWithChildren<{
  color?: ChipColor,
  variant?: ChipVariant,
  trailingIcon?: ReactNode,
}>

/**
 * A component for displaying a single chip
 */
export const Chip = ({
                       children,
                       trailingIcon,
                       color,
                       variant = 'normal',
                       className = '',
                       ...restProps
                     }: ChipProps) => {
  return (
    <div
      {...restProps}
      className={tx(
        `@(flex flex-row gap-x-2 w-fit px-2 py-1 text-tag-${color}-text bg-tag-${color}-background)`,
        {
          '@(rounded-md)': variant === 'normal',
          '@(rounded-full text-xs font-bold)': variant === 'fullyRounded',
        },
        className
      )}
    >
      {children}
      {trailingIcon && (<span className={tw(`@(text-tag-${color}-icon)`)}>{trailingIcon}</span>)}
    </div>
  )
}

export type ChipListProps = {
  list: ChipProps[],
  className?: string,
}

/**
 * A component for displaying a list of chips
 */
export const ChipList = ({
                           list,
                           className = ''
                         }: ChipListProps) => {
  return (
    <div className={tx('@(flex flex-wrap gap-x-4 gap-y-2)', className)}>
      {list.map((value, index) => (
        <Chip
          key={index}
          {...value}
          color={value.color ?? 'dark'}
          variant={value.variant ?? 'normal'}
        >
          {value.children}
        </Chip>
      ))}
    </div>
  )
}
