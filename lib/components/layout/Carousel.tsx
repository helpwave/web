import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '../../util/array'
import { Circle } from '../Circle'

type Heights = {
  desktop: number,
  tablet: number,
  mobile: number
}

type CarouselProps = {
  children: ReactNode[],
  isLooping?: boolean,
  hintNext?: boolean,
  arrows?: boolean,
  dots?: boolean,
  heights?: Heights,
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
  // isLooping = false,
  hintNext = false,
  arrows = true,
  dots = true,
  heights = {
    desktop: 300,
    tablet: 400,
    mobile: 450,
  },
  className = ''
}: CarouselProps) => {
  const [{ currentIndex, transitionInformation }, setCarouselInformation] = useState<CarouselInformation>({
    currentIndex: 0
  })
  const animationTime: number = 250 // in ms

  const length = children.length
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
    const distance = Math.min(distanceForward, distanceBackward)
    const paddingPercentage = 1.1

    const newTransitionInformation = {
      oldIndex: currentIndex,
      newIndex,
      direction: distanceForward < distanceBackward ? 1 : -1,
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

  const left = () => {
    updateIndex(currentIndex === 0 ? length - 1 : currentIndex - 1)
  }

  const right = () => {
    updateIndex((currentIndex + 1) % length)
  }

  const before = createLoopingListWithIndex(children, 0, 3, false).slice(1).reverse().map(([index, item]) => ({
    index,
    item
  }))
  const list = children.map((item, index) => ({ index, item }))
  const after = createLoopingListWithIndex(children, length - 1, 3).slice(1).map(([index, item]) => ({ index, item }))

  const items: ItemType[] = [
    ...before,
    ...list,
    ...after
  ]

  const height = `desktop:h-[${heights?.desktop}px] tablet:h-[${heights?.tablet}px] mobile:h-[${heights?.mobile}px]`

  return (
    <div className={tx(`relative w-full overflow-hidden`, height, className)}>
      {arrows && (
        <>
          <div
            className={tw('absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer')}
            onClick={() => left()}
          >
            <ChevronLeft size={32}/>
          </div>
          <div
            className={tw('absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer')}
            onClick={() => right()}
          >
            <ChevronRight size={32}/>
          </div>
        </>
      )}
      {dots && (
        <div
          className={tw('absolute z-10 bottom-0 left-1/2 -translate-x-1/2 flex flex-row items-center justify-center gap-x-2 bg-white rounded-lg p-2 mb-2')}>
          {range(0, length - 1).map(index => (
            <Circle
              key={index}
              radius={6}
              className={tx('hover:!bg-hw-primary-300 cursor-pointer', {
                '!bg-gray-200': currentIndex !== index,
                '!bg-hw-primary-200': currentIndex === index
              })}
              onClick={() => updateIndex(index)}
            />
          ))}
        </div>
      )}
      {hintNext ? (
        <div className={tx(`relative flex flex-row`, height)}>
          {items.map(({ index, item }, listIndex) => (
            <div
              key={listIndex}
              className={tw(`absolute w-[70%] left-[50%] desktop:w-1/2 desktop:left-1/2 h-full overflow-hidden`)}
              style={{ translate: getOffset(listIndex - 2) }}
              onClick={() => updateIndex(index)}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className={tw('px-16 h-full')}>
          {children[currentIndex]}
        </div>
      )}
    </div>
  )
}
