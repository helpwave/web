import { useCallback, useEffect, useState } from 'react'
import { tw, tx } from '../twind'
import { noop } from '../util/noop'
import { Circle } from './Circle'

export type RingProps = {
  innerSize: number, // the size of the entire circle including the circleWidth
  width: number,
  color?: string, // Tailwind color
  className?: string
};

export const Ring = ({
  innerSize = 20,
  width = 7,
  color = 'hw-primary-800',
  className = '',
}: RingProps) => {
  return (
    <div
      className={tx(
        `w-[${innerSize}px] h-[${innerSize}px] bg-transparent rounded-full outline outline-[${width}px] outline-${color}`,
        className
      )}
    />
  )
}

export type AnimatedRingProps = RingProps & {
  fillAnimationDuration?: number, // in seconds, 0 means no animation
  repeating?: boolean,
  onAnimationFinished?: () => void
};

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

  const animate = useCallback((timestamp: number, startTime: number) => {
    const progress = Math.min((timestamp - startTime) / milliseconds, 1)
    const newWidth = Math.min(width * progress, width)

    setCurrentWidth(newWidth)

    if (progress < 1) {
      requestAnimationFrame((newTimestamp) => animate(newTimestamp, startTime))
    } else {
      onAnimationFinished()
      if (repeating) {
        setCurrentWidth(0)
        requestAnimationFrame((newTimestamp) =>
          animate(newTimestamp, newTimestamp)
        )
      }
    }
  }, [milliseconds, onAnimationFinished, repeating, width])

  useEffect(() => {
    if (currentWidth < width) {
      requestAnimationFrame((timestamp) => animate(timestamp, timestamp))
    }
  }, []) // eslint-disable-line

  return (
    <div
      className={tx(
        `w-[${innerSize + 2 * width}px] h-[${
          innerSize + 2 * width
        }px] flex flex-row items-center justify-center`
      )}
    >
      <Ring
        innerSize={innerSize}
        width={currentWidth}
        color={color}
        className={className}
      />
    </div>
  )
}

export type RingWaveProps = Omit<AnimatedRingProps, 'innerSize'> & {
  startInnerSize: number,
  endInnerSize: number
};

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

  const animate = useCallback((timestamp: number, startTime: number) => {
    const progress = Math.min((timestamp - startTime) / milliseconds, 1)
    const newInnerSize = Math.min(
      startInnerSize + distance * progress,
      endInnerSize
    )

    setCurrentInnerSize(newInnerSize)

    if (progress < 1) {
      requestAnimationFrame((newTimestamp) => animate(newTimestamp, startTime))
    } else {
      onAnimationFinished()
      if (repeating) {
        setCurrentInnerSize(startInnerSize)
        requestAnimationFrame((newTimestamp) =>
          animate(newTimestamp, newTimestamp)
        )
      }
    }
  }, [distance, endInnerSize, milliseconds, onAnimationFinished, repeating, startInnerSize])

  useEffect(() => {
    if (currentInnerSize < endInnerSize) {
      requestAnimationFrame((timestamp) => animate(timestamp, timestamp))
    }
  }, []) // eslint-disable-line

  return (
    <div
      className={tx(
        `w-[${endInnerSize + 2 * width}px] h-[${
          endInnerSize + 2 * width
        }px] flex flex-row items-center justify-center`
      )}
    >
      <Ring
        innerSize={currentInnerSize}
        width={width}
        color={color}
        className={className}
      />
    </div>
  )
}

export type RadialRingsProps = {
  color1?: string,
  color2?: string,
  color3?: string,
  waveWidth?: number,
  waveBaseColor?: string,
  sizeCircle1?: number,
  sizeCircle2?: number,
  sizeCircle3?: number
};

// eslint-disable-next-line no-empty-pattern
export const RadialRings = ({
  color1 = 'hw-primary-700',
  color2 = 'hw-primary-500',
  color3 = 'hw-primary-400',
  waveWidth = 10,
  waveBaseColor = 'white',
  sizeCircle1 = 300,
  sizeCircle2 = 200,
  sizeCircle3 = 300
}: RadialRingsProps) => {
  const [currentRing, setCurrentRing] = useState(0)
  const size = sizeCircle3

  return (
    <div className={tw(`relative w-[${sizeCircle3}px] h-[${sizeCircle3}px]`)}>
      <Circle
        radius={sizeCircle1 / 2}
        color={color1}
        className={tw(
          `absolute z-[10] left-[${size / 2}px] top-[${
            size / 2
          }px] -translate-y-1/2 -translate-x-1/2`
        )}
      />
      {currentRing === 0 ? (
        <AnimatedRing
          innerSize={sizeCircle1}
          width={(sizeCircle2 - sizeCircle1) / 2}
          color={color2}
          onAnimationFinished={() =>
            currentRing === 0 ? setCurrentRing(1) : null
          }
          repeating={true}
          className={tx(
            { 'opacity-5': currentRing !== 0 },
            `absolute z-[9] left-[${size / 2}px] top-[${
              size / 2
            }px] -translate-y-1/2 -translate-x-1/2`
          )}
        />
      ) : null}
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={sizeCircle1 - waveWidth}
          endInnerSize={sizeCircle2}
          width={waveWidth}
          color={waveBaseColor}
          repeating={true}
          className={tx(
            `absolute z-[9] left-[${size / 2}px] top-[${
              size / 2
            }px] -translate-y-1/2 -translate-x-1/2 opacity-5`
          )}
        />
      ) : null}
      <Circle
        radius={sizeCircle2 / 2}
        color={color2}
        className={tx(
          { 'opacity-20': currentRing < 1 },
          `absolute z-[8] left-[${size / 2}px] top-[${
            size / 2
          }px] -translate-y-1/2 -translate-x-1/2`
        )}
      />
      {currentRing === 1 ? (
        <AnimatedRing
          innerSize={sizeCircle2 - 1} // potentially harmful
          width={(sizeCircle3 - sizeCircle2) / 2}
          color={color3}
          onAnimationFinished={() =>
            currentRing === 1 ? setCurrentRing(2) : null
          }
          repeating={true}
          className={tx(
            `absolute z-[7] left-[${size / 2}px] top-[${
              size / 2
            }px] -translate-y-1/2 -translate-x-1/2`
          )}
        />
      ) : null}
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={sizeCircle2}
          endInnerSize={sizeCircle3 - waveWidth}
          width={waveWidth}
          color={waveBaseColor}
          repeating={true}
          className={tx(
            `absolute z-[7] left-[${size / 2}px] top-[${
              size / 2
            }px] -translate-y-1/2 -translate-x-1/2 opacity-5`
          )}
        />
      ) : null}
      <Circle
        radius={sizeCircle3 / 2}
        color={color3}
        className={tx(
          { 'opacity-20': currentRing < 2 },
          `absolute z-[6] left-[${size / 2}px] top-[${
            size / 2
          }px] -translate-y-1/2 -translate-x-1/2`
        )}
      />
    </div>
  )
}
