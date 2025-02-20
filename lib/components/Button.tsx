import type { PropsWithChildren, ButtonHTMLAttributes, MouseEventHandler } from 'react'
import { tx } from '../twind'
import { getColoring } from '../coloring/util'
import type { AppColor } from '../twind/config'
import { appColorNames } from '../twind/config'
import type { ColoringStyle } from '../coloring/types'

export type ButtonColorType = AppColor | 'none'

export type ButtonProps = PropsWithChildren<{
  /**
   * Color variant of the button
   * @default 'primary' // as in the primary accent color
   */
  color?: ButtonColorType,
  /**
   * @default 'background'
   */
  variant?: ColoringStyle,
  /**
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large',
  /**
   * Additional override for styling, this will get merged with the styles selected through variant and size.
   */
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
}> & Omit<ButtonHTMLAttributes<Element>, 'onClick' | 'className'>

/**
 * A button with different styling options determined by the color, variant and size options
 */
const Button = ({
  children,
  disabled = false,
  color = 'hw-primary',
  variant = 'background',
  size = 'medium',
  onClick,
  className = undefined,
  ...restProps
}: ButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={tx(
      'font-medium focus:outline-none', className, {
        // disabled
        'text-hw-disabled-text bg-hw-disabled hover:bg-hw-disabled focus:bg-hw-disabled': disabled && variant !== 'text',
        'text-hw-disabled focus:ring-0': disabled && variant === 'text',
      },
      color !== 'none' ? {
        [getColoring({
          color,
          hover: true,
          style: variant
        })]: !disabled && appColorNames.some(value => value === color),
      } : {},
      {
        // {small, medium, large}
        'py-1 px-2 rounded text-sm': size === 'small',
        'py-2 px-4 rounded-md': size === 'medium',
        'py-2 px-4 rounded-md text-lg': size === 'large'
      }
    )}
    {...restProps}
  >
    {children}
  </button>
)

export { Button }
