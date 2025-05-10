import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type CircleProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
  radius: number,
  className?: string,
}

export const Circle = ({
  radius = 20,
  className = 'bg-primary',
  style,
  ...restProps
}: CircleProps) => {
  const size = radius * 2
  return (
    <div
      className={clsx(`rounded-full`, className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      {...restProps}
    />
  )
}
