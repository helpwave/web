import React from 'react'
import type { PropsWithChildren, ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

// TODO: add more variants
const variants = ['primary'] as const

type ButtonProps = PropsWithChildren<{
  /**
   * Color variant of the button
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

const Button = ({ children, disabled = false, variant, size = 'medium', onClick, className = undefined, ...restProps }: ButtonProps) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={cx('py-2 px-4 text-sm font-medium focus:outline-none', className, {
      'text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500': variant === 'primary',
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
