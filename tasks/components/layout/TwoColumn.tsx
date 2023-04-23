import { tw, tx } from '@helpwave/common/twind'
import type { ReactNode } from 'react'
import SimpleBarReact from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type LayoutState = 'normal' | 'leftMaximized'

type TwoColumnProps = {
  left: (layoutState: LayoutState) => ReactNode,
  right: (layoutState: LayoutState) => ReactNode
}

export const TwoColumn = ({ right, left }: TwoColumnProps) => {
  const [layoutState, setLayoutState] = useState<LayoutState>('normal')
  const headerHeight = 64
  return (
    <div className={tw(`flex flex-row h-[calc(100vh_-_${headerHeight}px)]`)}>
      <div className={tx('overflow-hidden', {
        'w-7/12': layoutState === 'normal',
        'flex-1': layoutState === 'leftMaximized'
      })}>
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {left(layoutState)}
        </SimpleBarReact>
      </div>
      <div
        className={tx(`relative flex my-4 rounded-lg bg-gray-300 w-0.5 justify-center`, { 'mr-4': layoutState === 'leftMaximized' })}>
        <button
          className={tw('absolute top-[5%] rounded-full bg-gray-300 hover:bg-gray-400 z-[1] border-white border-[3px] text-white p-0.5')}
          onClick={() => {
            setLayoutState(layoutState === 'normal' ? 'leftMaximized' : 'normal')
          }}
        >
          {layoutState === 'leftMaximized' ? <ChevronLeft/> : <ChevronRight/>}
        </button>
      </div>
      <div
        className={tx('overflow-hidden', {
          'flex-1': layoutState === 'normal',
          'hidden': layoutState === 'leftMaximized'
        })}
      >
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {right(layoutState)}
        </SimpleBarReact>
      </div>
    </div>
  )
}
