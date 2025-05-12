import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { noop } from '../../util/noop'
import { getNeighbours, range } from '../../util/array'
import { clamp } from '../../util/math'

export type ScrollPickerProps<T> = {
  options: T[],
  mapping: (value: T) => string,
  selected?: T,
  onChange?: (value: T) => void,
  disabled?: boolean,
}

type AnimationData<T> = {
  /** The index we scroll to */
  targetIndex: number,
  /** The index we are currently showing centered */
  currentIndex: number,
  items: T[],
  /** From -0.5 to 0.5 */
  transition: number,
  velocity: number,
  animationVelocity: number,
  lastTimeStamp?: number,
  lastScrollTimeStamp?: number,
}

const up = 1
const down = -1
type Direction = 1 | -1

/**
 * A component for picking an option by scrolling
 */
export const ScrollPicker = <T, >({
                                    options,
                                    mapping,
                                    selected,
                                    onChange = noop,
                                    disabled = false,
                                  }: ScrollPickerProps<T>) => {
  let selectedIndex = 0
  if (selected && options.indexOf(selected) !== -1) {
    selectedIndex = options.indexOf(selected)
  }
  const [{
    currentIndex,
    transition,
    items,
    lastTimeStamp
  }, setAnimation] = useState<AnimationData<T>>({
    targetIndex: selectedIndex,
    currentIndex: disabled ? selectedIndex : 0,
    velocity: 0,
    animationVelocity: Math.floor(options.length / 2),
    transition: 0,
    items: options,
  })

  const itemsShownCount = 5
  const shownItems = getNeighbours(range(0, items.length - 1), currentIndex).map(index => ({
    name: mapping(items[index]!), index
  }))

  const itemHeight = 40
  const distance = 8

  const containerHeight = itemHeight * (itemsShownCount - 2) + distance * (itemsShownCount - 2 + 1)

  const getDirection = useCallback((targetIndex: number, currentIndex: number, transition: number, length: number): Direction => {
    if (targetIndex === currentIndex) {
      return transition > 0 ? up : down
    }
    let distanceForward = targetIndex - currentIndex
    if (distanceForward < 0) {
      distanceForward += length
    }
    return distanceForward >= length / 2 ? down : up
  }, [])

  const animate = useCallback((timestamp: number, startTime: number | undefined) => {
    setAnimation((prevState) => {
      const {
        targetIndex,
        currentIndex,
        transition,
        animationVelocity,
        velocity,
        items,
        lastScrollTimeStamp
      } = prevState
      if (disabled) {
        return { ...prevState, currentIndex: targetIndex, velocity: 0, lastTimeStamp: timestamp }
      }
      if ((targetIndex === currentIndex && velocity === 0 && transition === 0) || !startTime) {
        return { ...prevState, lastTimeStamp: timestamp }
      }
      const progress = (timestamp - startTime) / 1000 // to seconds
      const direction = getDirection(targetIndex, currentIndex, transition, items.length)

      let newVelocity = velocity
      let usedVelocity
      let newCurrentIndex = currentIndex
      const isAutoScrolling = velocity === 0 && (!lastScrollTimeStamp || timestamp - lastScrollTimeStamp > 300)

      const newLastScrollTimeStamp = velocity !== 0 ? timestamp : lastScrollTimeStamp

      // manual scrolling
      if (isAutoScrolling) {
        usedVelocity = direction * animationVelocity
      } else {
        usedVelocity = velocity
        newVelocity = velocity * 0.5 // drag loss
        if (Math.abs(newVelocity) <= 0.05) {
          newVelocity = 0
        }
      }

      let newTransition = transition + usedVelocity * progress
      const changeThreshold = 0.5

      while (newTransition >= changeThreshold) {
        if (newCurrentIndex === targetIndex && newTransition >= changeThreshold && isAutoScrolling) {
          newTransition = 0
          break
        }
        newCurrentIndex = (currentIndex + 1) % items.length
        newTransition -= 1
      }
      if (newTransition >= changeThreshold) {
        newTransition = 0
      }
      while (newTransition <= -changeThreshold) {
        if (newCurrentIndex === targetIndex && newTransition <= -changeThreshold && isAutoScrolling) {
          newTransition = 0
          break
        }
        newCurrentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
        newTransition += 1
      }
      let newTargetIndex = targetIndex
      if (!isAutoScrolling) {
        newTargetIndex = newCurrentIndex
      }

      if ((currentIndex !== newTargetIndex || newTargetIndex !== targetIndex) && newTargetIndex === newCurrentIndex) {
        onChange(items[newCurrentIndex]!)
      }
      return {
        targetIndex: newTargetIndex,
        currentIndex: newCurrentIndex,
        animationVelocity,
        transition: newTransition,
        velocity: newVelocity,
        items,
        lastTimeStamp: timestamp,
        lastScrollTimeStamp: newLastScrollTimeStamp
      }
    })
  }, [disabled, getDirection, onChange])

  useEffect(() => {
    // constant update
    requestAnimationFrame((timestamp) => animate(timestamp, lastTimeStamp))
  })

  const opacity = (transition: number, index: number, itemsCount: number) => {
    const max = 100
    const min = 0
    const distance = max - min

    let opacityValue = min
    const unitTransition = clamp((transition) / 0.5)
    if (index === 1 || index === itemsCount - 2) {
      if (index === 1 && transition > 0) {
        opacityValue += Math.floor(unitTransition * distance)
      }
      if (index === itemsCount - 2 && transition < 0) {
        opacityValue += Math.floor(unitTransition * distance)
      }
    } else {
      opacityValue = max
    }

    // TODO this is not the right value for the bottom entry
    return clamp(1- (opacityValue / max))
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: containerHeight }}
      onWheel={event => {
        if (event.deltaY !== 0) {
          // TODO slower increase
          setAnimation(({ velocity, ...animationData }) =>
            ({ ...animationData, velocity: velocity + event.deltaY }))
        }
      }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2">
        <div
          className="absolute z-[1] top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-full min-w-[40px] border border-y-2 border-x-0 border-[#00000033]"
          style={{ height: `${itemHeight}px` }}
        />
        <div
          className="col select-none"
          style={{
            transform: `translateY(${-transition * (distance + itemHeight)}px)`,
            columnGap: `${distance}px`,
          }}
        >
          {shownItems.map(({ name, index }, arrayIndex) => (
            <div
              key={index}
              className={clsx(
                `col items-center justify-center rounded-md`,
                {
                  'text-primary font-bold': currentIndex === index,
                  'text-on-background': currentIndex === index,
                  'cursor-pointer': !disabled,
                  'cursor-not-allowed': disabled,
                }
              )}
              style={{
                opacity: currentIndex !== index ? opacity(transition, arrayIndex, shownItems.length) : undefined,
                height: `${itemHeight}px`,
                maxHeight: `${itemHeight}px`,
              }}
              onClick={() => !disabled && setAnimation(prevState => ({ ...prevState, targetIndex: index }))}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
