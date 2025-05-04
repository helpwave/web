import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'

type ItemGridProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode[],
  icon?: ReactNode,
  columns?: number,
}

const defaultIcon = (
  <div className={clsx('flex flex-col justify-center items-center bg-primary text-white rounded-full min-w-[24px] min-h-[24px]')}>
    <Check size={18} strokeWidth={2.5} />
  </div>
)

/**
 * A Component for creating a grid of items
 */
export const ItemGrid = ({
  children,
  icon = defaultIcon,
  columns = 2,
  className = ''
}: ItemGridProps) => {
  return (
    <div className={clsx(`grid grid-cols-${columns} gap-x-6 gap-y-4 overflow-x-auto`, className)}>
      {children.map((value, index) => (
        <div key={index} className={clsx('flex flex-row items-center gap-x-2')}>
          {icon}
          {value}
        </div>
      ))}
    </div>
  )
}
