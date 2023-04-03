import React from 'react'
import type { PropsWithChildren, ButtonHTMLAttributes } from 'react'
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
  onClick?: () => void
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
      'text-white bg-YYY-500    hover:bg-YYY-600    focus:ring-YYY-500': variant === 'primary' && color === 'negative' && !disabled, // TODO: red
      'text-white bg-ZZZ-500    hover:bg-ZZZ-600    focus:ring-ZZZ-500': variant === 'primary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

      // secondary & {accent, accent-secondary, positive, negative, neutral}
      'text-indigo-500 bg-indigo-200 hover:bg-indigo-300 focus:ring-indigo-200': variant === 'secondary' && color === 'accent' && !disabled, // TODO use hw-primary instead of indigo
      'text-AAA-500 bg-AAA-200       hover:bg-AAA-300    focus:ring-AAA-200': variant === 'secondary' && color === 'accent-secondary' && !disabled, // TODO: what could this be?
      'text-green-500 bg-green-200   hover:bg-green-300  focus:ring-green-200': variant === 'secondary' && color === 'positive' && !disabled, // TODO: green
      'text-rose-500 bg-rose-200     hover:bg-rose-300   focus:ring-rose-200': variant === 'secondary' && color === 'negative' && !disabled, // TODO: red
      'text-ZZZ-500 bg-ZZZ-200       hover:bg-ZZZ-300    focus:ring-ZZZ-200': variant === 'secondary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

      // tertiary & {accent, accent-secondary, positive, negative, neutral}
      'text-indigo-500 hover:underline focus:ring-indigo-200': variant === 'tertiary' && color === 'accent' && !disabled, // TODO use hw-primary instead of indigo
      'text-AAA-500    hover:underline focus:ring-AAA-200': variant === 'tertiary' && color === 'accent-secondary' && !disabled, // TODO: what could this be?
      'text-green-500  hover:underline focus:ring-green-200': variant === 'tertiary' && color === 'positive' && !disabled, // TODO: green
      'text-rose-500   hover:underline focus:ring-rose-200': variant === 'tertiary' && color === 'negative' && !disabled, // TODO: red
      'text-ZZZ-500    hover:underline focus:ring-ZZZ-200': variant === 'tertiary' && color === 'neutral' && !disabled, // TODO: maybe blue or yellow?

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
