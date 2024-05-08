import type { ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '../../util/array'
import { Circle } from '../Circle'

type CarouselProps = {
  children: ReactNode[],
  isLooping?: boolean,
  hintNext?: boolean,
  arrows?: boolean,
  dots?: boolean,
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
  className = ''
}: CarouselProps) => {
  const [{ currentIndex, transitionInformation }, setCarouselInformation] = useState<CarouselInformation>({
    currentIndex: 0
  })

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
      const progress = (time - transitionInformation.start) / 1000 * 2
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

    const newTransitionInformation = {
      oldIndex: currentIndex,
      newIndex,
      direction: distanceForward < distanceBackward ? 1 : -1,
      speed: distance / 500 * 110,
      change: 0
    }
    setCarouselInformation(prevState => ({
      ...prevState,
      newTransitionInformation
    }))

    requestAnimationFrame(time => {
      setCarouselInformation(prevState => ({
        ...prevState,
        transitionInformation: {
          ...newTransitionInformation,
          start: time
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

  const items: ItemType[] = []
  items.push(...createLoopingListWithIndex(children, currentIndex, 4, false).slice(0, 2).reverse().map(([index, item]) => ({
    index,
    item
  })))
  items.push(...children.map((item, index) => ({ index, item })))
  items.push(...createLoopingListWithIndex(children, currentIndex, 4).slice(2).map(([index, item]) => ({ index, item })))

  console.log(items, currentIndex, createLoopingListWithIndex(children, currentIndex, 4, false), createLoopingListWithIndex(children, currentIndex, 4))

  return (
    <div className={tx('relative w-full overflow-hidden h-[400px]', className)}>
      {arrows && (
        <>
          <div
            className={tw('absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg')}
            onClick={() => left()}
          >
            <ChevronLeft size={32}/>
          </div>
          <div
            className={tw('absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-lg')}
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
              className={tx('hover:!bg-hw-primary-300', {
                '!bg-gray-200': currentIndex !== index,
                '!bg-hw-primary-200': currentIndex === index
              })}
              onClick={() => setCarouselInformation({ currentIndex: index, transitionInformation: undefined })}
            />
          ))}
        </div>
      )}
      {hintNext ? (
        <div className={tw('relative flex flex-row')}>
          {items.map(({ index, item }, listIndex) => (
            <div
              key={listIndex}
              className={tw(`absolute w-1/2 left-1/2 max-h-[400px] overflow-hidden`)}
              style={{ translate: getOffset(listIndex - 2) }}
              onClick={() => updateIndex(index)}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className={tw('px-8')}>
          children[index]
        </div>
      )}
    </div>
  )
}
