import type { HTMLAttributes, ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { Check } from 'lucide-react'

type ItemGridProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode[],
  icon?: ReactNode,
  columns?: number
}

const defaultIcon = (
  <div className={tw('flex flex-col justify-center items-center bg-hw-primary-400 text-white rounded-full min-w-[24px] min-h-[24px]')}>
    <Check size={18} strokeWidth={2.5} />
  </div>
)

export const ItemGrid = ({
  children,
  icon = defaultIcon,
  columns = 2,
  className = ''
}: ItemGridProps) => {
  return (
    <div className={tx(`grid grid-cols-${columns} gap-x-6 gap-y-4 overflow-x-auto`, className)}>
      {children.map((value, index) => (
        <div key={index} className={tw('flex flex-row items-center gap-x-2')}>
          {icon}
          {value}
        </div>
      ))}
    </div>
  )
}
