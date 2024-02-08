import { useEffect, useState } from 'react'
import { tw, tx } from '../twind'
import { noop } from '../util/noop'
import { Circle } from './Circle'

export type RingProps = {
  innerSize: number, // the size of the entire circle including the circleWidth
  width: number,
  color?: string, // Tailwind color
  className?: string
}

export const Ring = ({
  innerSize = 20,
  width = 7,
  color = 'hw-primary-800',
  className = '',
}: RingProps) => {
  return (
    <div
      className={tx(`w-[${innerSize}px] h-[${innerSize}px] bg-transparent rounded-full outline outline-[${width}px] outline-${color}`, className)}
    />
  )
}

export type AnimatedRingProps = RingProps & {
  fillAnimationDuration?: number, // in seconds, 0 means no animation
  repeating?: boolean,
  onAnimationFinished?: () => void
}

export const AnimatedRing = ({
  innerSize,
  width,
  color,
  className,
  fillAnimationDuration = 3,
  repeating = false,
  onAnimationFinished = noop,
}: AnimatedRingProps) => {
  const [currentWidth, setCurrentWidth] = useState(0)
  const milliseconds = 1000 * fillAnimationDuration
  const updatesPerSecond = 30

  useEffect(() => {
    if (currentWidth < width) {
      const intervalId = setInterval(() => {
        setCurrentWidth((prevWidth) => {
          const newWidth = Math.min(prevWidth + (width / (fillAnimationDuration * updatesPerSecond)), width)
          if (newWidth >= width) {
            onAnimationFinished()
            if (repeating) {
              return 0
            }
          }
          return newWidth
        })
      }, 1000 / updatesPerSecond) // Adjust the interval as needed

      return () => clearInterval(intervalId)
    }
  }, [width, milliseconds, currentWidth, fillAnimationDuration, repeating, onAnimationFinished])

  return (
    <div
      className={tx(`w-[${innerSize + 2 * width}px] h-[${innerSize + 2 * width}px] flex flex-row items-center justify-center`)}>
      <Ring innerSize={innerSize} width={currentWidth} color={color} className={className}/>
    </div>
  )
}

export type RingWaveProps = Omit<AnimatedRingProps, 'innerSize'> & {
  startInnerSize: number,
  endInnerSize: number
}

export const RingWave = ({
  startInnerSize = 20,
  endInnerSize = 30,
  width,
  color,
  className,
  fillAnimationDuration = 3,
  repeating = false,
  onAnimationFinished = noop,
}: RingWaveProps) => {
  const [currentInnerSize, setCurrentInnerSize] = useState(startInnerSize)
  const distance = endInnerSize - startInnerSize
  const milliseconds = 1000 * fillAnimationDuration
  const updatesPerSecond = 30

  useEffect(() => {
    if (currentInnerSize < endInnerSize) {
      const intervalId = setInterval(() => {
        setCurrentInnerSize((prevInnerSize) => {
          const newInnerSize = Math.min(prevInnerSize + (distance / (fillAnimationDuration * updatesPerSecond)), endInnerSize)
          if (newInnerSize >= endInnerSize) {
            onAnimationFinished()
            if (repeating) {
              return startInnerSize
            }
          }
          return newInnerSize
        })
      }, 1000 / updatesPerSecond) // Adjust the interval as needed

      return () => clearInterval(intervalId)
    }
  }, [milliseconds, currentInnerSize, fillAnimationDuration, repeating, onAnimationFinished, endInnerSize, distance, startInnerSize])

  return (
    <div
      className={tx(`w-[${endInnerSize + 2 * width}px] h-[${endInnerSize + 2 * width}px] flex flex-row items-center justify-center`)}>
      <Ring innerSize={currentInnerSize} width={width} color={color} className={className}/>
    </div>
  )
}

export type RadialRingsProps = NonNullable<unknown>

// eslint-disable-next-line no-empty-pattern
export const RadialRings = ({}: RadialRingsProps) => {
  const [currentRing, setCurrentRing] = useState(0)
  const size = 400

  return (
    <div className={tw(`relative w-[${size}px] h-[${size}px]`)}>
      <Circle
        radius={50}
        color="hw-primary-700"
        className={tw(`absolute z-[10] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2`)}
      />
      {currentRing === 0 ? (
        <AnimatedRing
          innerSize={100}
          width={50}
          color="hw-primary-500"
          onAnimationFinished={() => currentRing === 0 ? setCurrentRing(1) : null}
          repeating={true}
          className={tx({ 'opacity-5': currentRing !== 0 }, `absolute z-[9] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2`)}
        />
      ) : null
      }
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={100 - 10}
          endInnerSize={200}
          width={10}
          color="white"
          repeating={true}
          className={tx(`absolute z-[9] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2 opacity-5`)}
        />
      ) : null
      }
      <Circle
        radius={100}
        color="hw-primary-500"
        className={tx({ 'opacity-20': currentRing < 1 }, `absolute z-[8] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2`)}
      />
      {currentRing === 1 ? (
        <AnimatedRing
          innerSize={199}
          width={50}
          color="hw-primary-400"
          onAnimationFinished={() => currentRing === 1 ? setCurrentRing(2) : null}
          repeating={true}
          className={tx(`absolute z-[7] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2`)}
        />
      ) : null
      }
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={200}
          endInnerSize={300 - 10}
          width={10}
          color="white"
          repeating={true}
          className={tx(`absolute z-[7] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2 opacity-5`)}
        />
      ) : null
      }
      <Circle
        radius={150}
        color="hw-primary-400"
        className={tx({ 'opacity-20': currentRing < 2 }, `absolute z-[6] left-[${size / 2}px] top-[${size / 2}px] -translate-y-1/2 -translate-x-1/2`)}
      />
    </div>
  )
}
