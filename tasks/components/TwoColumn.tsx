import { tw } from '@helpwave/common/twind/index'
import type { ReactNode } from 'react'

type TwoColumnProps = {
  left: ReactNode,
  right: ReactNode
}

export const TwoColumn = ({ right, left }: TwoColumnProps) => {
  const headerHeight = 64
  return (
    <div className={tw(`flex flex-row h-[calc(100vh_-_${headerHeight}px)]`)}>
      <div className={tw('overflow-auto w-7/12')}>
        {left}
      </div>
      <div className={tw(`my-4 rounded-lg bg-gray-300 w-0.5`)}/>
      <div className={tw('overflow-auto flex-1')}>
        {right}
      </div>
    </div>
  )
}
