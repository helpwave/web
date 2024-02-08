import { tx } from '../twind'

export type CircleProps = {
  radius: number,
  color?: string, // Tailwind color
  className?: string
}

export const Circle = ({
  radius = 20,
  color = 'hw-primary-400',
  className = '',
}: CircleProps) => {
  const size = radius * 2
  return (
    <div
      className={tx(`w-[${size}px] h-[${size}px] rounded-full bg-${color}`, className)}
    />
  )
}
