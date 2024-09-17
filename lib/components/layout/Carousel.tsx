import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '../../util/array'
import { noop } from '../../util/noop'

type Heights = {
  desktop: number,
  tablet: number,
  mobile: number
}

const defaultHeights: Heights = {
  desktop: 350,
  tablet: 400,
  mobile: 350,
}

type CarouselProps = {
  children: ReactNode[],
  onCardClick?: (index: number) => void,
  isLooping?: boolean,
  hintNext?: boolean,
  arrows?: boolean,
  dots?: boolean,
  heights?: Partial<Heights>,
  blurColor?: string,
  className?: string
}

type ItemType = {
  item: ReactNode,
  index: number
}

type CarouselAnimationState = {
  targetIndex: number,
  /**
   * Value of either 1 or -1, 1 is forwards -1 is backwards
   */
  direction: number,
  startTime: number,
  lastUpdate: number
}

type DragState = {
  startX: number,
  startTime: number,
  lastX: number,
  startIndex: number
}

type CarouselInformation = {
  currentIndex: number,
  offset: number,
  dragState?: DragState,
  animationState?: CarouselAnimationState
}

export const Carousel = ({
  children,
  onCardClick = noop,
  isLooping = false,
  hintNext = false,
  arrows = false,
  dots = true,
  heights = defaultHeights,
  blurColor = 'white',
  className = ''
}: CarouselProps) => {
  const [{
    currentIndex,
    offset,
    dragState,
    animationState,
  }, setCarouselInformation] = useState<CarouselInformation>({
    currentIndex: 0,
    offset: 0,
  })
  const isAnimating = animationState !== undefined
  const cardsPerSecond: number = 4 // in ms per card, musst be != 0

  const length = children.length
  const paddingItemCount = 2 // The number of items to append left and right of the list to allow for clean transition when looping

  heights = { ...defaultHeights, ...heights }

  const getOffset = (index: number) => {
    let baseOffset = -50 + -offset * 100
    if (index === currentIndex) {
      return `${baseOffset}%`
    }
    baseOffset += 100 * (index - currentIndex)

    return `${baseOffset}%`
  }

  const animation = useCallback((time: number) => {
    let keepAnimating: boolean = true

    // Other calculation in the setState call to avoid updating the useCallback to often
    setCarouselInformation((state) => {
      const {
        currentIndex,
        offset,
        animationState,
      } = state
      if (animationState === undefined) {
        keepAnimating = false
        return state
      }
      const progress = (time - animationState.lastUpdate) / 1000 // passed seconds
      const change = cardsPerSecond * progress * animationState.direction // the update offset to apply
      let newOffset = change + offset
      let newIndex = currentIndex
      if (animationState.direction === 1) {
        while (newIndex !== animationState.targetIndex && newOffset > 0.5) {
          newOffset--
          if (newIndex === length - 1) {
            if (!isLooping) {
              newOffset = 0
              break
            } else {
              newIndex = (newIndex + 1) % length
            }
          } else {
            newIndex++
          }
        }
        if (newIndex === animationState.targetIndex && newOffset > 0) {
          newOffset = 0
        }
      } else {
        while (newIndex !== animationState.targetIndex && newOffset < -0.5) {
          newOffset++
          if (newIndex === 0) {
            if (!isLooping) {
              newOffset = 0
              break
            } else {
              newIndex--
              if (newIndex < 0) {
                newIndex += length
              }
            }
          } else {
            newIndex--
          }
        }
        if (newIndex === animationState.targetIndex && newOffset < 0) {
          newOffset = 0
        }
      }

      if (animationState.targetIndex === newIndex && newOffset === 0) {
        keepAnimating = false
        return ({
          currentIndex: newIndex,
          offset: newOffset,
          animationState: undefined
        })
      }
      return ({
        currentIndex: newIndex,
        offset: newOffset,
        animationState: {
          ...animationState!,
          lastUpdate: time
        }
      })
    })
    if (keepAnimating) {
      requestAnimationFrame(animation)
    }
  }, [isLooping, length])

  const startAnimation = (targetIndex?: number) => {
    if (targetIndex === undefined) {
      targetIndex = currentIndex
    }
    if (targetIndex === currentIndex && offset === 0) {
      return // we are exactly where we want to be
    }

    // find target index and fastest path to it
    let direction = targetIndex <= currentIndex ? -1 : 1
    if (isLooping) {
      let distanceForward = targetIndex - currentIndex
      if (distanceForward < 0) {
        distanceForward += length
      }
      const distanceBackward = length - distanceForward
      // let distance = Math.min(distanceForward, distanceBackward)
      direction = distanceForward < distanceBackward ? 1 : -1
    }
    if (targetIndex === currentIndex) {
      direction = offset > 0 ? -1 : 1
    }

    requestAnimationFrame(startTime => {
      setCarouselInformation(prevState => ({
        ...prevState,
        dragState: undefined,
        animationState: {
          targetIndex,
          direction,
          startTime,
          lastUpdate: startTime
        }
      }))
      requestAnimationFrame(animation)
    })
  }

  const canGoLeft = () => {
    return isLooping || currentIndex !== 0
  }

  const canGoRight = () => {
    return isLooping || currentIndex !== length - 1
  }

  const left = () => {
    if (canGoLeft()) {
      startAnimation(currentIndex === 0 ? length - 1 : currentIndex - 1)
    }
  }

  const right = () => {
    if (canGoRight()) {
      startAnimation((currentIndex + 1) % length)
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
      startIndex: currentIndex,
    },
    animationState: undefined // cancel animation
  }))

  const onDrag = (x: number, width: number) => {
    // For some weird reason the clientX is 0 on the last dragUpdate before drag end causing issues
    if (!dragState || x === 0) {
      return
    }
    const offsetUpdate = (dragState.lastX - x) / width
    let newOffset = offset + offsetUpdate
    let newIndex = currentIndex
    if (newOffset >= 0.5) {
      const ceiledOffset = Math.ceil(newOffset)
      if (isLooping) {
        newIndex = (currentIndex + ceiledOffset) % length
      } else {
        newIndex = Math.min(currentIndex + ceiledOffset, length - 1)
      }
      newOffset -= Math.min(ceiledOffset, 1) // 0.6 ceiled to 1 gets us -0.4, min constrain if we have large scrolls
    } else if (newOffset <= -0.5) {
      const flooredOffset = Math.floor(newOffset)
      const absOffset = Math.abs(flooredOffset)

      if (isLooping) {
        newIndex = currentIndex - (absOffset % length)
        if (newIndex < 0) {
          newIndex += length
        }
      } else {
        newIndex = Math.max(currentIndex - absOffset, 0)
      }
      newOffset += Math.max(-1, absOffset)
    }
    // sanity check
    if (!isLooping) {
      const overScrollThreshold = 0.2
      if (newOffset > overScrollThreshold && newIndex === length - 1) {
        newOffset = overScrollThreshold
      } else if (newOffset < -overScrollThreshold && newIndex === 0) {
        newOffset = -overScrollThreshold
      }
    }

    setCarouselInformation(prevState => ({
      ...prevState,
      offset: newOffset,
      currentIndex: newIndex,
      dragState: {
        ...dragState,
        lastX: x
      },
    }))
  }

  const onDragEnd = (x: number) => {
    if (!dragState) {
      return
    }
    const distance = dragState.startX - x
    const duration = (Date.now() - dragState.startTime) // in milliseconds
    const velocity = distance / (Date.now() - dragState.startTime)

    const isSlide = Math.abs(velocity) > 2 || (duration < 200 && Math.abs(distance) > 20)
    if (isSlide && dragState.startIndex === currentIndex) {
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
                item
              }, listIndex) => (
                <div
                  key={listIndex}
                  className={tx(`absolute w-[70%] left-[50%] desktop:w-1/2 desktop:left-1/2 h-full overflow-hidden`)}
                  style={{ translate: getOffset(listIndex - (isLooping ? paddingItemCount : 0)) }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div
              className={tw(`hidden desktop:block absolute left-0 h-full w-[22%] bg-gradient-to-r from-${blurColor} to-transparent`)}
            />
            <div
              className={tw(`hidden desktop:block absolute right-0 h-full w-[22%] bg-gradient-to-l from-${blurColor} to-transparent`)}
            />
          </div>
        ) : (
          <div className={tw('px-16 h-full')}>
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
                '!bg-hw-primary-200': currentIndex === index
              })}
              onClick={() => startAnimation(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
