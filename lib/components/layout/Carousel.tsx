import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '../../util/array'

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

type TransitionInformation = {
  oldIndex: number,
  newIndex: number,
  start: number,
  direction: number,
  speed: number,
  change: number
}

type CarouselInformation = {
  currentIndex: number,
  transitionInformation?: TransitionInformation
}

export const Carousel = ({
  children,
  isLooping = false,
  hintNext = false,
  arrows = false,
  dots = true,
  heights = defaultHeights,
  blurColor = 'white',
  className = ''
}: CarouselProps) => {
  const [{ currentIndex, transitionInformation }, setCarouselInformation] = useState<CarouselInformation>({
    currentIndex: 0
  })
  const animationTime: number = 250 // in ms

  const length = children.length
  const paddingItemCount = 2 // The number of items to append left and right of the list to allow for clean transition when looping

  heights = { ...defaultHeights, ...heights }

  const getOffset = (index: number) => {
    const padding = 10 // 10%
    let baseOffset = -50 + (transitionInformation?.change ?? 0) * -(100 + padding)
    if (index === currentIndex) {
      return `${baseOffset}%`
    }
    baseOffset += (100 + padding) * (index - currentIndex)

    return `${baseOffset}%`
  }

  const updateCycle = useCallback((time: number) => {
    setCarouselInformation((state) => {
      const {
        currentIndex,
        transitionInformation
      } = state
      if (transitionInformation === undefined) {
        return state
      }
      const progress = (time - transitionInformation.start) / 1000
      let change = transitionInformation.change + progress * transitionInformation.direction * transitionInformation.speed
      let newIndex = currentIndex
      if (transitionInformation.direction === 1) {
        while (newIndex !== transitionInformation.newIndex && change > 1) {
          change = change + 1
          newIndex = (newIndex + 1) % length
        }
      } else {
        while (newIndex !== transitionInformation.newIndex && change < -1) {
          change = change + 1
          newIndex--
          if (newIndex < 0) {
            newIndex = length - 1
          }
        }
      }

      if (transitionInformation?.newIndex === newIndex) {
        return ({
          currentIndex: newIndex
        })
      }
      return ({
        currentIndex: newIndex,
        transitionInformation: {
          ...transitionInformation!,
          change,
          start: time
        }
      })
    })
    requestAnimationFrame(updateCycle)
  }, [length])

  const updateIndex = (newIndex: number) => {
    if (newIndex === currentIndex) {
      return
    }
    let distanceForward = newIndex - currentIndex
    if (distanceForward < 0) {
      distanceForward += length
    }
    const distanceBackward = length - distanceForward
    let distance = Math.min(distanceForward, distanceBackward)
    let direction = distanceForward < distanceBackward ? 1 : -1
    if (!isLooping) {
      if (newIndex <= currentIndex) {
        distance = distanceBackward
        direction = -1
      } else {
        distance = distanceForward
        direction = 1
      }
    }

    const paddingPercentage = 1.1

    const newTransitionInformation = {
      oldIndex: currentIndex,
      newIndex,
      direction,
      speed: distance * paddingPercentage / (animationTime / 1000),
      change: 0
    }

    requestAnimationFrame(time => {
      setCarouselInformation(prevState => ({
        ...prevState,
        transitionInformation: {
          ...newTransitionInformation,
          start: time,
          change: prevState.transitionInformation?.change ?? newTransitionInformation.change
        }
      }))
      requestAnimationFrame(updateCycle)
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
      updateIndex(currentIndex === 0 ? length - 1 : currentIndex - 1)
    }
  }

  const right = () => {
    if (canGoRight()) {
      updateIndex((currentIndex + 1) % length)
    }
  }

  let items: ItemType[] = children.map((item, index) => ({ index, item }))

  if (isLooping) {
    const before = createLoopingListWithIndex(children, length - 1, paddingItemCount, false).reverse().map(([index, item]) => ({
      index,
      item
    }))
    const after = createLoopingListWithIndex(children, 0, paddingItemCount).map(([index, item]) => ({ index, item }))
    items = [
      ...before,
      ...items,
      ...after
    ]
  }

  const height = `desktop:h-[${heights?.desktop}px] tablet:h-[${heights?.tablet}px] mobile:h-[${heights?.mobile}px]`

  return (
    <div className={tw('flex flex-col items-center w-full gap-y-2')}>
      <div className={tx(`relative w-full overflow-hidden`, height, className)}>
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
              {items.map(({ index, item }, listIndex) => (
                <div
                  key={listIndex}
                  className={tx(`absolute w-[70%] left-[50%] desktop:w-1/2 desktop:left-1/2 h-full overflow-hidden`)}
                  style={{ translate: getOffset(listIndex - (isLooping ? paddingItemCount : 0)) }}
                  onClick={() => updateIndex(index)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className={tw(`hidden desktop:block absolute left-0 h-full w-[22%] bg-gradient-to-r from-${blurColor} to-transparent`)}
                 onClick={left}/>
            <div className={tw(`hidden desktop:block absolute right-0 h-full w-[22%] bg-gradient-to-l from-${blurColor} to-transparent`)}
                 onClick={right}/>
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
              onClick={() => updateIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
