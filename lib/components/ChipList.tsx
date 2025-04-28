import type { HTMLProps, PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'

export type ChipColor = 'default' | 'dark'
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
  }[color]

  const colorMappingIcon: string = {
    default: 'text-tag-default-icon',
    dark: 'text-tag-dark-icon',
  }[color]

  return (
    <div
      {...restProps}
      className={clsx(
        `flex flex-row gap-x-2 w-fit px-2 py-1`,
        colorMapping,
        {
          'rounded-md': variant === 'normal',
          'rounded-full text-xs font-bold': variant === 'fullyRounded',
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
