import type { PropsWithChildren, ButtonHTMLAttributes, ReactNode } from 'react'
import { tx } from '@helpwave/style-themes/twind'
import type {
  OutlineButtonColor,
  SolidButtonColor,
  TextButtonColor
} from '@helpwave/style-themes/twind/theme-variables'

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

const sizePaddings: Record<ButtonSizes, string> = {
  small: '@(py-1 px-[10px] rounded text-sm)',
  medium: '@(py-2 px-3 rounded-md)',
  large: '@(py-[10px] px-4 rounded-md text-lg)'
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
                     }: SolidButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={tx(
      '@(flex flex-row gap-x-2 font-medium focus:outline-none)', className, {
        // disabled
        '@(text-disabled-text bg-disabled-background)': disabled,
      },
      sizePaddings[size],
      `@(bg-button-solid-${color}-background text-button-solid-${color}-text)`
    )}
    {...restProps}
  >
    {startIcon && (
      <span
        className={tx({
          [`@(text-button-solid-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {startIcon}
      </span>
    )}
    {children}
    {endIcon && (
      <span
        className={tx({
          [`@(text-button-solid-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {endIcon}
      </span>
    )}
  </button>
)

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
                       }: OutlineButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={tx(
      '@(flex flex-row gap-x-2 font-medium bg-transparent outline-none border-2)', className, {
        // disabled
        '@(text-disabled-text border-disabled-outline)': disabled,
      },
      sizePaddings[size],
      `@(border-button-outline-${color}-outline text-button-outline-${color}-text)`
    )}
    {...restProps}
  >
    {startIcon && (
      <span
        className={tx({
          [`@(text-button-outline-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {startIcon}
      </span>
    )}
    {children}
    {endIcon && (
      <span
        className={tx({
          [`@(text-button-outline-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {endIcon}
      </span>
    )}
  </button>
)

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
                    }: TextButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={tx(
      '@(flex flex-row gap-x-2 font-medium bg-transparent outline-none)', className, {
        // disabled
        '@(text-disabled-text)': disabled,
      },
      sizePaddings[size],
      `@(text-button-text-${color}-text)`
    )}
    {...restProps}
  >
    {startIcon && (
      <span
        className={tx({
          [`@(text-button-text-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {startIcon}
      </span>
    )}
    {children}
    {endIcon && (
      <span
        className={tx({
          [`@(text-button-text-${color}-icon)`]: !disabled,
          [`@(text-disabled-icon)`]: !disabled
        })}
      >
        {endIcon}
      </span>
    )}
  </button>
)

export { SolidButton, OutlineButton, TextButton }
