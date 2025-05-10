import type { PropsWithChildren, ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export type SolidButtonColor = 'primary' | 'secondary' | 'tertiary' | 'positive' | 'warning'| 'negative'
export type OutlineButtonColor = 'primary'
export type TextButtonColor = 'negative' | 'neutral'

type ButtonSizes = 'small' | 'medium' | 'large'

/**
 * The shard properties between all button types
 */
export type ButtonProps = PropsWithChildren<{
  /**
   * @default 'medium'
   */
  size?: ButtonSizes,
}> & ButtonHTMLAttributes<Element>

export const ButtonSizePaddings: Record<ButtonSizes, string> = {
  small: 'btn-sm',
  medium: 'btn-md',
  large: 'btn-lg'
}

type ButtonWithIconsProps = ButtonProps & {
  startIcon?: ReactNode,
  endIcon?: ReactNode,
}

export type SolidButtonProps = ButtonWithIconsProps & {
  color?: SolidButtonColor,
}

export type OutlineButtonProps = ButtonWithIconsProps & {
  color?: OutlineButtonColor,
}

export type TextButtonProps = ButtonWithIconsProps & {
  color?: TextButtonColor,
}

/**
 * A button with a solid background and different sizes
 */
const SolidButton = ({
                       children,
                       disabled = false,
                       color = 'primary',
                       size = 'medium',
                       startIcon,
                       endIcon,
                       onClick,
                       className,
                       ...restProps
                     }: SolidButtonProps) => {
  const colorClasses = {
    primary: 'bg-button-solid-primary-background text-button-solid-primary-text',
    secondary: 'bg-button-solid-secondary-background text-button-solid-secondary-text',
    tertiary: 'bg-button-solid-tertiary-background text-button-solid-tertiary-text',
    positive: 'bg-button-solid-positive-background text-button-solid-positive-text',
    warning: 'bg-button-solid-warning-background text-button-solid-warning-text',
    negative: 'bg-button-solid-negative-background text-button-solid-negative-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-solid-primary-icon',
    secondary: 'text-button-solid-secondary-icon',
    tertiary: 'text-button-solid-tertiary-icon',
    positive: 'text-button-solid-positive-icon',
    warning: 'text-button-solid-warning-icon',
    negative: 'text-button-solid-negative-icon',
  }[color]

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className,
        {
          'text-disabled-text bg-disabled-background': disabled,
          [clsx(colorClasses, 'hover:brightness-90')]: !disabled
        },
        ButtonSizePaddings[size]
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {endIcon}
      </span>
      )}
    </button>
  )
}

/**
 * A button with an outline border and different sizes
 */
const OutlineButton = ({
                         children,
                         disabled = false,
                         color = 'primary',
                         size = 'medium',
                         startIcon,
                         endIcon,
                         onClick,
                         className,
                         ...restProps
                       }: OutlineButtonProps) => {
  const colorClasses = {
    primary: 'bg-transparent border-2 border-button-outline-primary-text text-button-outline-primary-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-outline-primary-icon',
  }[color]
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className, {
          'text-disabled-text border-disabled-outline)': disabled,
          [clsx(colorClasses, 'hover:brightness-80')]: !disabled,
        },
        ButtonSizePaddings[size]
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {endIcon}
      </span>
      )}
    </button>
  )
}

/**
 * A text that is a button that can have different sizes
 */
const TextButton = ({
                      children,
                      disabled = false,
                      color = 'neutral',
                      size = 'medium',
                      startIcon,
                      endIcon,
                      onClick,
                      className,
                      ...restProps
                    }: TextButtonProps) => {
  const colorClasses = {
    negative: 'bg-transparent text-button-text-negative-text',
    neutral: 'bg-transparent text-button-text-neutral-text',
  }[color]

  const iconColorClasses = {
    negative: 'text-button-text-negative-icon',
    neutral: 'text-button-text-neutral-icon',
  }[color]
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className, {
          'text-disabled-text': disabled,
          [clsx(colorClasses, 'hover:bg-button-text-hover-background rounded-full')]: !disabled,
        },
        ButtonSizePaddings[size]
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {endIcon}
      </span>
      )}
    </button>
  )
}

// TODO Icon button

export { SolidButton, OutlineButton, TextButton }
