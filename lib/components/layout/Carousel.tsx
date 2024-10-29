import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '../../util/array'
import { clamp } from '../../util/math'
import { EaseFunctions } from '../../util/easeFunctions'
import type { Direction } from '../../util/loopingArray'
import { LoopingArrayCalculator } from '../../util/loopingArray'
import type { ScreenTypes } from '../../twind/config'

type Heights = Record<ScreenTypes, number>

const defaultHeights: Heights = {
  desktop: 350,
  tablet: 400,
  mobile: 350,
}

type ItemWidths = Record<ScreenTypes, string | undefined>

const defaultItemWidths: ItemWidths = {
  desktop: '50%',
  tablet: '70%',
  mobile: '70%',
}

type CarouselProps = {
  children: ReactNode[],
  animationTime?: number,
  isLooping?: boolean,
  isAutoLooping?: boolean,
  autoLoopingTimeOut?: number,
  autoLoopAnimationTime?: number,
  hintNext?: boolean,
  arrows?: boolean,
  dots?: boolean,
  /**
   * Percentage that is allowed to be scrolled further
   */
  overScrollThreshold?: number,
  heights?: Partial<Heights>,
  blurColor?: string,
  itemWidths?: ItemWidths,
  className?: string
}

type ItemType = {
  item: ReactNode,
  index: number
}

type CarouselAnimationState = {
  targetPosition: number,
  /**
   * Value of either 1 or -1, 1 is forwards -1 is backwards
   */
  direction: Direction,
  startPosition: number,
  startTime?: number,
  lastUpdateTime?: number,
  isAutoLooping: boolean
}

type DragState = {
  startX: number,
  startTime: number,
  lastX: number,
  startIndex: number
}

type CarouselInformation = {
  currentPosition: number,
  dragState?: DragState,
  animationState?: CarouselAnimationState
}

export const Carousel = ({
  children,
  animationTime = 200,
  isLooping = false,
  isAutoLooping = false,
  autoLoopingTimeOut = 5000,
  autoLoopAnimationTime = 500,
  hintNext = false,
  arrows = false,
  dots = true,
  overScrollThreshold = 0.1,
  heights = defaultHeights,
  blurColor = 'white',
  itemWidths = defaultItemWidths,
  className = ''
}: CarouselProps) => {
  if (isAutoLooping && !isLooping) {
    console.error('When isAutoLooping is true, isLooping should also be true')
    isLooping = true
  }

  const [{
    currentPosition,
    dragState,
    animationState,
  }, setCarouselInformation] = useState<CarouselInformation>({
    currentPosition: 0,
  })
  const animationId = useRef<number | undefined>(undefined)
  const timeOut = useRef<NodeJS.Timeout | undefined>(undefined)
  autoLoopingTimeOut = Math.max(0, autoLoopingTimeOut)

  const length = children.length
  const paddingItemCount = 3 // The number of items to append left and right of the list to allow for clean transition when looping

  const util = useMemo(() => new LoopingArrayCalculator(length, isLooping, overScrollThreshold), [length, isLooping, overScrollThreshold])
  const currentIndex = util.getCorrectedPosition(LoopingArrayCalculator.withoutOffset(currentPosition))
  animationTime = Math.max(200, animationTime) // in ms, must be > 0
  autoLoopAnimationTime = Math.max(200, autoLoopAnimationTime)

  heights = { ...defaultHeights, ...heights }
  itemWidths = { ...defaultItemWidths, ...itemWidths }

  const getStyleOffset = (index: number) => {
    const baseOffset = -50 + (index - currentPosition) * 100
    return `${baseOffset}%`
  }

  const animation = useCallback((time: number) => {
    let keepAnimating: boolean = true

    // Other calculation in the setState call to avoid updating the useCallback to often
    setCarouselInformation((state) => {
      const {
        animationState,
        dragState
      } = state
      if (animationState === undefined || dragState !== undefined) {
        keepAnimating = false
        return state
      }
      if (!animationState.startTime || !animationState.lastUpdateTime) {
        return {
          ...state,
          animationState: {
            ...animationState,
            startTime: time,
            lastUpdateTime: time
          }
        }
        if (newIndex === animationState.targetIndex && newOffset < 0) {
          newOffset = 0
        }
      }
      const useAnimationTime = animationState.isAutoLooping ? autoLoopAnimationTime : animationTime
      const progress = clamp((time - animationState.startTime) / useAnimationTime) // progress
      const easedProgress = EaseFunctions.easeInEaseOut(progress)
      const distance = util.getDistanceDirectional(animationState.startPosition, animationState.targetPosition, animationState.direction)
      const newPosition = util.getCorrectedPosition(easedProgress * distance * animationState.direction + animationState.startPosition)

      if (animationState.targetPosition === newPosition || progress === 1) {
        keepAnimating = false
        return ({
          currentPosition: LoopingArrayCalculator.withoutOffset(newPosition),
          animationState: undefined
        })
      }
      return ({
        currentPosition: newPosition,
        animationState: {
          ...animationState!,
          lastUpdateTime: time
        }
      })
    })
    if (keepAnimating) {
      animationId.current = requestAnimationFrame(time1 => animation(time1))
    }
  }, [animationTime, autoLoopAnimationTime, util])

  useEffect(() => {
    if (animationState) {
      animationId.current = requestAnimationFrame(animation)
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
        animationId.current = 0
      }
      const distanceBackward = length - distanceForward
      // let distance = Math.min(distanceForward, distanceBackward)
      direction = distanceForward < distanceBackward ? 1 : -1
    }
    if (targetIndex === currentIndex) {
      direction = offset > 0 ? -1 : 1
    }
  }, [animationState]) // eslint-disable-line react-hooks/exhaustive-deps

  const startAutoLoop = () => setCarouselInformation(prevState => ({
    ...prevState,
    dragState: prevState.dragState,
    animationState: prevState.animationState || prevState.dragState ? prevState.animationState : {
      startPosition: currentPosition,
      targetPosition: (currentPosition + 1) % length,
      direction: 1, // always move forward
      isAutoLooping: true
    }
  }))

  useEffect(() => {
    if (!animationId.current && !animationState && !dragState && !timeOut.current) {
      if (autoLoopingTimeOut > 0) {
        timeOut.current = setTimeout(() => {
          startAutoLoop()
          timeOut.current = undefined
        }, autoLoopingTimeOut)
      } else {
        startAutoLoop()
      }
    }
  }, [animationState, dragState, animationId.current, timeOut.current]) // eslint-disable-line react-hooks/exhaustive-deps

  const startAnimation = (targetPosition?: number) => {
    if (targetPosition === undefined) {
      targetPosition = LoopingArrayCalculator.withoutOffset(currentPosition)
    }
    if (targetPosition === currentPosition) {
      return // we are exactly where we want to be
    }

    // find target index and fastest path to it
    const direction = util.getBestDirection(currentPosition, targetPosition)
    clearTimeout(timeOut.current)
    timeOut.current = undefined
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
      animationId.current = undefined
    }

    setCarouselInformation(prevState => ({
      ...prevState,
      dragState: undefined,
      animationState: {
        targetPosition: targetPosition!,
        direction,
        startPosition: currentPosition,
        isAutoLooping: false
      },
      timeOut: undefined
    }))
  }

  const canGoLeft = () => {
    return isLooping || currentPosition !== 0
  }

  const canGoRight = () => {
    return isLooping || currentPosition !== length - 1
  }

  const left = () => {
    if (canGoLeft()) {
      startAnimation(currentPosition === 0 ? length - 1 : LoopingArrayCalculator.withoutOffset(currentPosition - 1))
    }
  }

  const right = () => {
    if (canGoRight()) {
      startAnimation(LoopingArrayCalculator.withoutOffset((currentPosition + 1) % length))
    }
  }

  let items: ItemType[] = children.map((item, index) => ({
    index,
    item
  }))

  if (isLooping) {
    const before = createLoopingListWithIndex(children, length - 1, paddingItemCount, false).reverse().map(([index, item]) => ({
      index,
      item
    }))
    const after = createLoopingListWithIndex(children, 0, paddingItemCount).map(([index, item]) => ({
      index,
      item
    }))
    items = [
      ...before,
      ...items,
      ...after
    ]
  }

  const height = `desktop:h-[${heights?.desktop}px] tablet:h-[${heights?.tablet}px] mobile:h-[${heights?.mobile}px]`

  const onDragStart = (x: number) => setCarouselInformation(prevState => ({
    ...prevState,
    dragState: {
      lastX: x,
      startX: x,
      startTime: Date.now(),
      startIndex: currentPosition,
    },
    animationState: undefined // cancel animation
  }))

  const onDrag = (x: number, width: number) => {
    // For some weird reason the clientX is 0 on the last dragUpdate before drag end causing issues
    if (!dragState || x === 0) {
      return
    }
    const offsetUpdate = (dragState.lastX - x) / width
    const newPosition = util.getCorrectedPosition(currentPosition + offsetUpdate)

    setCarouselInformation(prevState => ({
      ...prevState,
      currentPosition: newPosition,
      dragState: {
        ...dragState,
        lastX: x
      },
    }))
  }

  const onDragEnd = (x: number, width: number) => {
    if (!dragState) {
      return
    }
    const distance = dragState.startX - x
    const relativeDistance = distance / width
    const duration = (Date.now() - dragState.startTime) // in milliseconds
    const velocity = distance / (Date.now() - dragState.startTime)

    const isSlide = Math.abs(velocity) > 2 || (duration < 200 && (Math.abs(relativeDistance) > 0.2 || Math.abs(distance) > 50))
    if (isSlide) {
      if (distance > 0 && canGoRight()) {
        right()
        return
      } else if (distance < 0 && canGoLeft()) {
        left()
        return
      }
    }
    startAnimation()
  }

  const dragHandlers = {
    draggable: true,
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => {
      onDragStart(event.clientX)
      event.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    },
    onDrag: (event: React.DragEvent<HTMLDivElement>) => onDrag(event.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => onDragEnd(event.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => onDragStart(event.touches[0]!.clientX),
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => onDrag(event.touches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => onDragEnd(event.changedTouches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchCancel: (event: React.TouchEvent<HTMLDivElement>) => onDragEnd(event.changedTouches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
  }

  return (
    <div className={tw('flex flex-col items-center w-full gap-y-2')}>
      <div className={tx(`relative w-full overflow-hidden`, height, className)}>
        <div
          // This is the click target
          className={tw('absolute z-20 h-full w-full')}
          onClick={event => {
            const rect = (event.target as HTMLDivElement).getBoundingClientRect()
            const clickX = event.clientX - rect.left
            const divWidth = rect.width
            const sectionWidth = 0.22
            if (clickX < divWidth * sectionWidth) {
              left()
            } else if (clickX > divWidth * (1 - sectionWidth)) {
              right()
            } else {
              if (isAnimating) {
                startAnimation()
              } else {
                onCardClick(currentIndex)
              }
            }
          }}
          draggable={true}
          onDragStart={event => onDragStart(event.clientX)}
          onDrag={event => onDrag(event.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width)}
          onDragEnd={event => onDragEnd(event.clientX)}
          onTouchStart={event => onDragStart(event.touches[0]!.clientX)}
          onTouchMove={event => onDrag(event.touches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width)}
          onTouchEnd={event => onDragEnd(event.changedTouches[0]!.clientX)}
          onTouchCancel={event => onDragEnd(event.changedTouches[0]!.clientX)}
        />
        {arrows && (
          <>
            <div
              className={tx('absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer border-black border-2', { hidden: !canGoLeft() })}
              onClick={() => left()}
            >
              <ChevronLeft size={32}/>
            </div>
            <div
              className={tx('absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer border-black border-2', { hidden: !canGoRight() })}
              onClick={() => right()}
            >
              <ChevronRight size={32}/>
            </div>
          </>
        )}
        {hintNext ? (
          <div className={tx(`relative flex flex-row`, height)}>
            <div className={tw('relative flex flex-row w-full px-2 overflow-hidden')}>
              {items.map(({
                item,
                index
              }, listIndex) => (
                <div
                  key={listIndex}
                  className={tx(`absolute left-[50%] desktop:w-[${itemWidths?.desktop}] tablet:w-[${itemWidths?.tablet}] mobile:w-[${itemWidths?.mobile}] h-full overflow-hidden`, { '!cursor-grabbing': !!dragState })}
                  style={{ translate: getStyleOffset(listIndex - (isLooping ? paddingItemCount : 0)) }}
                  {...dragHandlers}
                  onClick={() => startAnimation(index)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div
              className={tw(`hidden pointer-events-none desktop:block absolute left-0 h-full w-[20%] bg-gradient-to-r from-${blurColor} to-transparent`)}
            />
            <div
              className={tw(`hidden pointer-events-none desktop:block absolute right-0 h-full w-[20%] bg-gradient-to-l from-${blurColor} to-transparent`)}
            />
          </div>
        ) : (
          <div className={tx('px-16 h-full', { '!cursor-grabbing': !!dragState })} {...dragHandlers}>
            {children[currentIndex]}
          </div>
        )}
      </div>
      {dots && (
        <div
          className={tw('flex flex-row w-full items-center justify-center gap-x-2 my-2')}>
          {range(0, length - 1).map(index => (
            <div
              key={index}
              className={tx('hover:!bg-hw-primary-300 cursor-pointer first:rounded-l-md last:rounded-r-md min-w-[32px] min-h-[12px]', {
                '!bg-gray-200': currentIndex !== index,
                '!bg-hw-primary-300/80': currentIndex === index
              })}
              onClick={() => startAnimation(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
