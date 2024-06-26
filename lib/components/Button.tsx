import type { PropsWithChildren, ButtonHTMLAttributes, MouseEventHandler } from 'react'
import { tx } from '../twind'

// TODO: add more variants
// TODO: this could be matched to some kind of tailwind/twind custom colors
// TODO: what about a "link color" and a "black/gray" color?
const colors = ['accent', 'accent-secondary', 'positive', 'negative', 'neutral', 'warn', 'none'] as const // TODO: this should be named differently, for example: "accent", "good"/"positive", "average"/"neutral", "bad"/"negative"
const variants = ['primary', 'secondary', 'tertiary', 'textButton'] as const

export type ButtonColorType = typeof colors[number]

export type ButtonProps = PropsWithChildren<{
  /**
   * Color variant of the button
   * @default 'primary' // as in the primary accent color
   */
  color?: ButtonColorType,
  /**
   * Importance, visibility, prominence, obtrusiveness of the button
   * E.g.
   * - the **primary** button is the most visible,
   * - the **secondary** button is somewhat prominently displayed,
   * - the **tertiary** button is the least obtrusive
   * @default 'primary'
   */
  variant?: typeof variants[number],
  /**
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large',
  /**
   * Additional override for styling, this will get merged with the styles selected through variant and size.
   */
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>
}> & Omit<ButtonHTMLAttributes<Element>, 'onClick' | 'className'>

/**
 * A button with different styling options determined by the color, variant and size options
 */
const Button = ({
  children,
  disabled = false,
  color = 'accent',
  variant = 'primary',
  size = 'medium',
  onClick,
  className = undefined,
  ...restProps
}: ButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={tx('py-2 font-medium focus:outline-none', className, {
      'px-4 text-sm': variant !== 'textButton',

      // disabled
      'text-white bg-gray-400 hover:bg-gray-400 focus:bg-gray-400': disabled && variant !== 'textButton',
      'text-gray-400 focus:ring-0': disabled && variant === 'textButton',

      // primary & {accent, accent-secondary, positive, negative, neutral}
      'text-white bg-hw-primary-400 hover:bg-hw-primary-600 focus:ring-hw-primary-600': variant === 'primary' && color === 'accent' && !disabled,
      'text-white bg-hw-secondary-400    hover:bg-hw-secondary-500    focus:ring-hw-secondary-400': variant === 'primary' && color === 'accent-secondary' && !disabled,
      'text-white bg-hw-positive-400    hover:bg-hw-positive-500    focus:ring-hw-positive-400': variant === 'primary' && color === 'positive' && !disabled,
      'text-white bg-hw-negative-400    hover:bg-hw-negative-500    focus:ring-hw-negative-400': variant === 'primary' && color === 'negative' && !disabled,
      'text-white bg-gray-400    hover:bg-gray-500    focus:ring-gray-400': variant === 'primary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?
      'text-white bg-hw-warn-400    hover:bg-hw-warn-500    focus:ring-hw-warn-400': variant === 'primary' && color === 'warn' && !disabled,

      // secondary & {accent, accent-secondary, positive, negative, neutral}
      'text-hw-primary-400 bg-hw-primary-100 hover:bg-hw-primary-200 focus:ring-hw-primary-100': variant === 'secondary' && color === 'accent' && !disabled,
      'text-hw-secondary-500 bg-hw-secondary-200       hover:bg-hw-secondary-300    focus:ring-hw-secondary-200': variant === 'secondary' && color === 'accent-secondary' && !disabled,
      'text-hw-positive-400 bg-hw-positive-100   hover:bg-hw-positive-200  focus:ring-hw-positive-100': variant === 'secondary' && color === 'positive' && !disabled,
      'text-hw-negative-400 bg-hw-negative-100   hover:bg-hw-negative-200  focus:ring-hw-negative-100': variant === 'secondary' && color === 'negative' && !disabled,
      'text-gray-500 bg-gray-200       hover:bg-gray-300    focus:ring-gray-200': variant === 'secondary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?
      'text-hw-warn-400 bg-hw-warn-200   hover:bg-hw-warn-300  focus:ring-hw-warn-200': variant === 'secondary' && color === 'warn' && !disabled,

      // tertiary & {accent, accent-secondary, positive, negative, neutral}
      'border-2': variant === 'tertiary',

      'text-hw-primary-400  border-hw-primary-400 hover:border-hw-primary-600 hover:text-hw-primary-600 focus:ring-hw-primary-100': variant === 'tertiary' && color === 'accent' && !disabled,
      'text-hw-secondary-400    border-hw-secondary-400 hover:borderhw-secondary-500 hover:text-hw-secondary-500 focus:ring-hw-secondary-200': variant === 'tertiary' && color === 'accent-secondary' && !disabled,
      'text-hw-positive-400  border-hw-positive-400 hover:border-hw-positive-600 hover:text-hw-positive-600 focus:ring-hw-positive-200': variant === 'tertiary' && color === 'positive' && !disabled,
      'text-hw-negative-400   border-hw-negative-400 hover:border-hw-negative-600 hover:text-hw-negative-600 focus:ring-hw-negative-200': variant === 'tertiary' && color === 'negative' && !disabled,
      'text-gray-500    border-gray-500 hover:border-gray-700 hover:text-gray-700 focus:ring-gray-300': variant === 'tertiary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?
      'text-hw-warn-400 border-hw-warn-400 hover:border-hw-warn-600 hover:text-hw-warn-600 focus:ring-hw-warn-200': variant === 'tertiary' && color === 'warn' && !disabled,

      // text button & {accent, accent-secondary, positive, negative, neutral}
      'text-hw-primary-400 hover:text-hw-primary-500 focus:ring-0': variant === 'textButton' && color === 'accent' && !disabled,
      'text-hw-secondary-400 hover:text-hw-secondary-400 focus:ring-0': variant === 'textButton' && color === 'accent-secondary' && !disabled,
      'text-hw-positive-400 hover:text-hw-positive-500 focus:ring-0': variant === 'textButton' && color === 'positive' && !disabled,
      'text-hw-negative-500 hover:text-hw-negative-600 focus:ring-0': variant === 'textButton' && color === 'negative' && !disabled,
      'text-gray-500 hover:text-gray-500 focus:ring-0 underline': variant === 'textButton' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?
      'text-hw-warn-400 hover:text-hw-warn-500 focus:ring-0': variant === 'textButton' && color === 'warn' && !disabled,

      // {small, medium, large}
      'TODO1': size === 'small', // TODO: add styles for small buttons
      'rounded-md': size === 'medium', // TODO: add styles for medium buttons
      'rounded-md w-full focus:ring-2 focus:ring-offset-2': size === 'large'
    })}
    {...restProps}
  >
    {children}
  </button>
)

export { Button }
