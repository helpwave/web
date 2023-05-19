import { tw, tx } from '@helpwave/common/twind'
import type { ReactNode } from 'react'
import SimpleBarReact from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { createRef, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import type SimpleBarCore from 'simplebar-core'

/**
 * Only px and %
 * e.g. 250px or 10%
 */
type Constraint = {
  min: string,
  max?: string
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
 * of the columns can be changed via the initialLayoutState
 */
export const TwoColumn = ({
  right,
  left,
  baseLayoutPercentage = 0.5,
  disableResize = true,
  constraints = { left: { min: '33%' }, right: { min: '33%' } }
}: TwoColumnProps) => {
  const ref = createRef<HTMLDivElement>()
  const [fullWidth, setFullWidth] = useState(0)
  const [leftWidth, setLeftWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const headerHeight = 64
  const dividerHitBoxWidth = 24

  useEffect(() => {
    if (fullWidth === 0) {
      setLeftWidth(baseLayoutPercentage * (ref.current?.clientWidth ?? 0))
    }
    setFullWidth(ref.current?.clientWidth ?? 0)
  }, [ref.current?.clientWidth])

  const convertToNumber = (constraint: string) => {
    if (constraint.endsWith('px')) {
      const value = parseFloat(constraint.substring(0, constraint.length - 2))
      if (isNaN(value)) {
        console.error(`Couldn't parse constraint ${constraint}`)
      }
      return value
    } else if (constraint.endsWith('%')) {
      const value = parseFloat(constraint.substring(0, constraint.length - 1))
      if (isNaN(value)) {
        console.error(`Couldn't parse constraint ${constraint}`)
      }
      return value / 100 * fullWidth
    } else {
      console.error(`Couldn't parse constraint ${constraint}`)
      return 0
    }
  }

  // TODO Update this to be more clear and use all/better constraints
  const calcPosition = (dragPosition: number) => {
    const leftMin = convertToNumber(constraints.left.min)
    const rightMin = convertToNumber(constraints.right.min)
    let left = dragPosition
    if (dragPosition < leftMin) {
      left = leftMin
    } else if (fullWidth - dragPosition - dividerHitBoxWidth < rightMin) {
      left = fullWidth - rightMin
    }
    return left
  }

  const leftFocus = baseLayoutPercentage * fullWidth < leftWidth - dividerHitBoxWidth / 2

  const scrollableRef = useRef<SimpleBarCore>(null)
  const [simpleBarMaxHeight, setSimpleBarMaxHeight] = useState(800)

  useEffect(() => {
    const handleWindowResize = () => {
      const scrollableElement = scrollableRef.current
      setSimpleBarMaxHeight(window.innerHeight - headerHeight)
      if (scrollableElement) {
        scrollableElement.recalculate()
      }
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <div
      ref={ref} className={tx(`relative flex flex-row h-[calc(100vh_-_${headerHeight}px)]`, { 'select-none': isDragging })}
      onMouseMove={event => isDragging ? setLeftWidth(calcPosition(event.pageX)) : undefined}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      {...{} /* maybe move these functions above as listeners on the entire document instead of just the TwoColumn */}
    >
      <div
        className={tw(`overflow-hidden`)}
        style={{ width: leftWidth + 'px' }}
      >
        <SimpleBarReact ref={scrollableRef} style={{ maxHeight: simpleBarMaxHeight }}>
          {left(leftWidth)}
        </SimpleBarReact>
      </div>
      <div
        onMouseDown={() => disableResize ? undefined : setIsDragging(true)}
        onTouchStart={() => disableResize ? undefined : setIsDragging(true)}
        className={tx(`relative h-full flex justify-center bg-white w-[${dividerHitBoxWidth}px]`, { '!cursor-col-resize': !disableResize })}
      >
          <div className={tw('bg-gray-300 my-4 rounded-lg w-0.5')} />
        {!disableResize && (
          <div
            className={tw('absolute top-[50%] bg-gray-300 rounded-xl w-4 h-12 -translate-y-[50%] flex flex-col justify-center items-center')}
          >
            <GripVertical className={tw('text-white')}/>
          </div>
        )}
        {!disableResize && (
          <button
            className={tw('absolute top-[5%] rounded-full bg-gray-300 hover:bg-gray-400 z-[1] border-white border-[3px] text-white p-0.5')}
            onClick={() => setLeftWidth(leftFocus ? fullWidth * baseLayoutPercentage : fullWidth - convertToNumber(constraints.right.min))}
          >
            {leftFocus ? <ChevronLeft/> : <ChevronRight/>}
          </button>
        )}
      </div>
      <div
        className={tw(`overflow-hidden`)}
        style={{ width: (fullWidth - leftWidth) + 'px' }}
      >
        <SimpleBarReact ref={scrollableRef} style={{ maxHeight: simpleBarMaxHeight }}>
          {right(fullWidth - leftWidth)}
        </SimpleBarReact>
      </div>
    </div>
  )
}
