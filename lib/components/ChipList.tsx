import type { HTMLProps, PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'

export type ChipColor = 'default' | 'dark'| 'red' | 'yellow' | 'green' | 'blue' | 'pink'
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
                       color = 'default',
                       variant = 'normal',
                       className = '',
                       ...restProps
                     }: ChipProps) => {
  const colorMapping: string = {
    default: 'text-tag-default-text bg-tag-default-background',
    dark: 'text-tag-dark-text bg-tag-dark-background',
    red: 'text-tag-red-text bg-tag-red-background',
    yellow: 'text-tag-yellow-text bg-tag-yellow-background',
    green: 'text-tag-green-text bg-tag-green-background',
    blue: 'text-tag-blue-text bg-tag-blue-background',
    pink: 'text-tag-pink-text bg-tag-pink-background',
  }[color]

  const colorMappingIcon: string = {
    default: 'text-tag-default-icon',
    dark: 'text-tag-dark-icon',
    red: 'text-tag-red-icon',
    yellow: 'text-tag-yellow-icon',
    green: 'text-tag-green-icon',
    blue: 'text-tag-blue-icon',
    pink: 'text-tag-pink-icon',
  }[color]

  return (
    <div
      {...restProps}
      className={clsx(
        `row w-fit px-2 py-1`,
        colorMapping,
        {
          'rounded-md': variant === 'normal',
          'rounded-full': variant === 'fullyRounded',
        },
        className
      )}
    >
      {children}
      {trailingIcon && (<span className={colorMappingIcon}>{trailingIcon}</span>)}
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
    <div className={clsx('flex flex-wrap gap-x-4 gap-y-2', className)}>
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
