import { tw } from '@helpwave/common/twind'
import type { ReactNode } from 'react'

import SimpleBarReact from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

type TwoColumnProps = {
  left: ReactNode,
  right: ReactNode
}

export const TwoColumn = ({ right, left }: TwoColumnProps) => {
  const headerHeight = 64
  return (
    <div className={tw(`flex flex-row h-[calc(100vh_-_${headerHeight}px)]`)}>
      <div className={tw('overflow-hidden w-7/12')}>
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {left}
        </SimpleBarReact>
      </div>
      <div className={tw(`my-4 rounded-lg bg-gray-300 w-0.5`)}/>
      <div className={tw('overflow-hidden flex-1')}>
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {right}
        </SimpleBarReact>
      </div>
    </div>
  )
}
