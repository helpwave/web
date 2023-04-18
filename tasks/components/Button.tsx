import React from 'react'
import type { PropsWithChildren, ButtonHTMLAttributes, MouseEventHandler } from 'react'
import { tx } from '@helpwave/common/twind/index'

// TODO: add more variants
// TODO: this could be matched to some kind of tailwind/twind custom colors
// TODO: what about a "link color" and a "black/gray" color?
const colors = ['accent', 'accent-secondary', 'positive', 'negative', 'neutral'] as const // TODO: this should be named differently, for example: "accent", "good"/"positive", "average"/"neutral", "bad"/"negative"
const variants = ['primary', 'secondary', 'tertiary'] as const

type ButtonProps = PropsWithChildren<{
  /**
   * Color variant of the button
   * @default 'primary' // as in the primary accent color
   */
  color?: typeof colors[number],
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
    className={tx('py-2 px-4 text-sm font-medium focus:outline-none', className, {
      // disabled
      'text-white bg-gray-400 hover:bg-gray-400 focus:bg-gray-400': disabled,

      // primary & {accent, accent-secondary, positive, negative, neutral}
      'text-white bg-hw-primary-400 hover:bg-hw-primary-600 focus:hw-primary-600': variant === 'primary' && color === 'accent' && !disabled,
      'text-white bg-AAA-500    hover:bg-AAA-600    focus:ring-AAA-500': variant === 'primary' && color === 'accent-secondary' && !disabled, // TODO: what could this be?
      'text-white bg-hw-positive-400    hover:bg-hw-positive-500    focus:ring-hw-positive-400': variant === 'primary' && color === 'positive' && !disabled,
      'text-white bg-hw-negative-400    hover:bg-hw-negative-500    focus:ring-hw-negative-400': variant === 'primary' && color === 'negative' && !disabled,
      'text-white bg-gray-400    hover:bg-gray-500    focus:ring-gray-400': variant === 'primary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

      // secondary & {accent, accent-secondary, positive, negative, neutral}
      'text-hw-primary-400 bg-hw-primary-100 hover:bg-hw-primary-200 focus:ring-hw-primary-100': variant === 'secondary' && color === 'accent' && !disabled,
      'text-AAA-500 bg-AAA-200       hover:bg-AAA-300    focus:ring-AAA-200': variant === 'secondary' && color === 'accent-secondary' && !disabled, // TODO: what could this be?
      'text-hw-positive-400 bg-hw-positive-100   hover:bg-hw-positive-200  focus:ring-hw-positive-100': variant === 'secondary' && color === 'positive' && !disabled,
      'text-hw-negative-400 bg-hw-negative-100   hover:bg-hw-negative-200  focus:ring-hw-negative-100': variant === 'secondary' && color === 'negative' && !disabled,
      'text-gray-500 bg-gray-200       hover:bg-gray-300    focus:ring-gray-200': variant === 'secondary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

      // tertiary & {accent, accent-secondary, positive, negative, neutral}
      'text-hw-primary-400 hover:underline focus:ring-hw-primary-100': variant === 'tertiary' && color === 'accent' && !disabled,
      'text-AAA-500    hover:underline focus:ring-AAA-200': variant === 'tertiary' && color === 'accent-secondary' && !disabled, // TODO: what could this be?
      'text-hw-positive-400  hover:underline focus:ring-hw-positive-200': variant === 'tertiary' && color === 'positive' && !disabled,
      'text-hw-negative-400  hover:underline focus:ring-hw-negative-200': variant === 'tertiary' && color === 'negative' && !disabled,
      'text-gray-500    hover:underline focus:ring-gray-300': variant === 'tertiary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

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
