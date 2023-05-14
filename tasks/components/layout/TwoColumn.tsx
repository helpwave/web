import { tw, tx } from '@helpwave/common/twind'
import type { ReactNode } from 'react'
import SimpleBarReact from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { createRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Constraint = {
  min: number,
  max: number
}

type ColumnConstraints = {
  left : Constraint,
  right: Constraint
}

type TwoColumnProps = {
  left: (width: number) => ReactNode,
  right: (width: number) => ReactNode,
  baseLayoutPercentage?: number, // Given as a percentage. Between 0 and 1
  disableResize?: boolean,
  constraints?: ColumnConstraints
}

/**
 * The layout component for most pages main content. It creates two columns with a divider in between. The size
 * of the columns can be change via the initialLayoutState
 */
export const TwoColumn = ({
  right,
  left,
  baseLayoutPercentage = 0.5,
  disableResize = true,
  constraints = { left: { min: 24, max: Infinity }, right: { min: 24, max: Infinity } }
}: TwoColumnProps) => {
  const ref = createRef<HTMLDivElement>()
  const [fullWidth, setFullWidth] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [dragImage, setDragImage] = useState<HTMLElement>()
  const headerHeight = 64
  const dividerHitBoxWidth = 24

  useEffect(() => {
    if (fullWidth === 0) {
      setLeftWidth(baseLayoutPercentage * (ref.current?.clientWidth ?? 0))
    }
    setFullWidth(ref.current?.clientWidth ?? 0)
  }, [ref.current?.clientWidth])

  useEffect(() => setDragImage(document.createElement('div')), [])

  // TODO Update this to be more clear and use all/better constraints
  const calcPosition = (dragPosition: number) => {
    let left = dragPosition
    if (dragPosition < constraints.left.min) {
      left = constraints.left.min
    } else if (fullWidth - dragPosition - dividerHitBoxWidth < constraints.right.min) {
      left = fullWidth - constraints.right.min
    }
    return left
  }

  const leftFocus = baseLayoutPercentage * fullWidth < leftWidth - dividerHitBoxWidth / 2

  return (
    <div ref={ref} className={tw(`relative flex flex-row h-[calc(100vh_-_${headerHeight}px)]`)}>
      <div
        className={tw(`overflow-hidden`)}
        style={{ width: leftWidth + 'px' }}
      >
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {left(leftWidth)}
        </SimpleBarReact>
      </div>
      <div
        draggable
        onDragStart={event => {
          event.dataTransfer.setDragImage(dragImage ?? document.createElement('div'), 0, 0)
        }}
        onDragEnd={event => {
          if (disableResize) {
            return
          }
          setLeftWidth(calcPosition(event.pageX))
        }}
        onDrag={event => {
          if (disableResize) {
            return
          }
          // Overscrolling to the right makes the value 0, so we block this
          if (event.pageX !== 0) {
            setLeftWidth(calcPosition(event.pageX))
          }
          event.preventDefault()
        }}
        className={tx(`relative h-full flex justify-center bg-white w-[${dividerHitBoxWidth}px]`, { 'cursor-col-resize': !disableResize })}
      >
          <div className={tw('bg-gray-300 my-4 rounded-lg w-0.5')} />
          <div className={tw('absolute top-[50%] bg-gray-300 rounded-xl w-6 h-20 -translate-y-[50%]')} />
        {!disableResize && (
          <button
            className={tw('absolute top-[5%] rounded-full bg-gray-300 hover:bg-gray-400 z-[1] border-white border-[3px] text-white p-0.5')}
            onClick={() => setLeftWidth(leftFocus ? fullWidth * baseLayoutPercentage : fullWidth - constraints.right.min)}
          >
            {leftFocus ? <ChevronLeft/> : <ChevronRight/>}
          </button>
        )}
      </div>
      <div
        className={tw(`overflow-hidden`)}
        style={{ width: (fullWidth - leftWidth) + 'px' }}
      >
        <SimpleBarReact style={{ maxHeight: window.innerHeight - headerHeight }}>
          {right(fullWidth - leftWidth)}
        </SimpleBarReact>
      </div>
    </div>
  )
}
