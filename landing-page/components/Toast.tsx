import type { ReactNode } from 'react'
import { tw, tx } from '@helpwave/common/twind/index'

type ToastProps = {
  message: string,
  /**
   * @default 'light'
   */
  theme: 'light' | 'dark',
  /**
   * @default 'simple'
   */
  variant: 'simple' | 'primary' | 'secondary' | 'positive' | 'negative' | 'neutral' | 'info',
  /**
   * @default false
   */
  border?: boolean,
  icon?: ReactNode
}

// TODO: I'm not fully satisfied with the design of this component, maybe I'll revisit it later and change the visuals
// TODO: things I'm considering:
// TODO: - allowing independent border and text colors (maybe also icon color?)
// TODO: - optional close/clear/whatever button?
// TODO: - icon position (left or right)
// TODO: - different shades for text color (currently using 500 and 300)
// TODO: - all white background may not be the best idea, maybe use a light gray background instead?
// TODO: - all black text for variant="simple" and theme="light" are also something to consider changing
export const Toast = ({ message, theme = 'light', variant = 'simple', icon, border = false }: ToastProps) => (
  <div className={tx('px-4 py-2 rounded-lg flex items-center shadow-lg gap-x-2', {
    // background color
    'bg-white': theme === 'light',
    'bg-hw-dark-gray-800': theme === 'dark',

    // text & border color (variant === 'simple')
    // darken / lighten the text color based on the theme
    'text-black border-black': theme === 'light' && variant === 'simple',
    'text-white border-white': theme === 'dark' && variant === 'simple',

    // text & border color (variant !== 'simple')
    // we just use all of our twind colors here
    // darken / lighten the text color based on the theme
    [`text-hw-${variant}-500 border-hw-${variant}-500`]: theme === 'light' && variant !== 'simple',
    [`text-hw-${variant}-300 border-hw-${variant}-300`]: theme === 'dark' && variant !== 'simple',

    // border (color is set above, this just activates the border)
    'border-2': border,
  })}>
    {icon ? <div className={tw('')}>{icon}</div> : null}
    <div className={tw('')}>{message}</div>
  </div>
)
