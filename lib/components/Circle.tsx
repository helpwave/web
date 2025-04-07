import type { HTMLAttributes } from 'react'
import { tx } from '@helpwave/style-themes/twind'

export type CircleProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  radius: number,
  color?: string, // Tailwind color
  className?: string,
}

export const Circle = ({
  radius = 20,
  color = 'primary-400',
  className = '',
  ...restProps
}: CircleProps) => {
  const size = radius * 2
  return (
    <div
      className={tx(`@(w-[${size}px] h-[${size}px] rounded-full bg-${color})`, className)}
      {...restProps}
    />
  )
}
