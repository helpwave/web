import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { noop } from '../util/noop'
import { Circle } from './Circle'
import clsx from 'clsx'

export type RingProps = {
  innerSize: number, // the size of the entire circle including the circleWidth
  width: number,
  className?: string,
};

export const Ring = ({
                       innerSize = 20,
                       width = 7,
                       className = 'outline-primary',
                     }: RingProps) => {
  return (
    <div
      className={clsx(`bg-transparent rounded-full outline`, className)}
      style={{
        width: `${innerSize}px`,
        height: `${innerSize}px`,
        outlineWidth: `${width}px`,
      }}
    />
  )
}

export type AnimatedRingProps = RingProps & {
  fillAnimationDuration?: number, // in seconds, 0 means no animation
  repeating?: boolean,
  onAnimationFinished?: () => void,
  style?: CSSProperties,
};

export const AnimatedRing = ({
                               innerSize,
                               width,
                               className,
                               fillAnimationDuration = 3,
                               repeating = false,
                               onAnimationFinished = noop,
                               style,
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
        requestAnimationFrame((newTimestamp) => animate(newTimestamp, newTimestamp))
      }
    }
  }, [milliseconds, onAnimationFinished, repeating, width])

  useEffect(() => {
    if (currentWidth < width) {
      requestAnimationFrame((timestamp) => animate(timestamp, timestamp))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="row items-center justify-center"
      style={{
        width: `${innerSize + 2 * width}px`,
        height: `${innerSize + 2 * width}px`,
        ...style,
      }}
    >
      <Ring
        innerSize={innerSize}
        width={currentWidth}
        className={className}
      />
    </div>
  )
}

export type RingWaveProps = Omit<AnimatedRingProps, 'innerSize'> & {
  startInnerSize: number,
  endInnerSize: number,
  style?: CSSProperties,
};

export const RingWave = ({
                           startInnerSize = 20,
                           endInnerSize = 30,
                           width,
                           className,
                           fillAnimationDuration = 3,
                           repeating = false,
                           onAnimationFinished = noop,
                           style
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
        requestAnimationFrame((newTimestamp) => animate(newTimestamp, newTimestamp))
      }
    }
  }, [distance, endInnerSize, milliseconds, onAnimationFinished, repeating, startInnerSize])

  useEffect(() => {
    if (currentInnerSize < endInnerSize) {
      requestAnimationFrame((timestamp) => animate(timestamp, timestamp))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="row items-center justify-center"
      style={{
        width: `${endInnerSize + 2 * width}px`,
        height: `${endInnerSize + 2 * width}px`,
        ...style
      }}
    >
      <Ring
        innerSize={currentInnerSize}
        width={width}
        className={className}
      />
    </div>
  )
}

export type RadialRingsProps = {
  circle1ClassName?: string,
  circle2ClassName?: string,
  circle3ClassName?: string,
  waveWidth?: number,
  waveBaseColor?: string,
  sizeCircle1?: number,
  sizeCircle2?: number,
  sizeCircle3?: number,
};

// TODO use fixed colors here to avoid artifacts
export const RadialRings = ({
                              circle1ClassName = 'bg-primary/90 outline-primary/90',
                              circle2ClassName = 'bg-primary/60 outline-primary/60',
                              circle3ClassName = 'bg-primary/40 outline-primary/40',
                              waveWidth = 10,
                              waveBaseColor = 'outline-white/20',
                              sizeCircle1 = 100,
                              sizeCircle2 = 200,
                              sizeCircle3 = 300
                            }: RadialRingsProps) => {
  const [currentRing, setCurrentRing] = useState(0)
  const size = sizeCircle3

  return (
    <div
      className="relative"
      style={{
        width: `${sizeCircle3}px`,
        height: `${sizeCircle3}px`,
      }}
    >
      <Circle
        radius={sizeCircle1 / 2}
        className={clsx(circle1ClassName, `absolute z-[10] -translate-y-1/2 -translate-x-1/2`)}
        style={{
          left: `${size / 2}px`,
          top: `${size / 2}px`
        }}
      />
      {currentRing === 0 ? (
        <AnimatedRing
          innerSize={sizeCircle1}
          width={(sizeCircle2 - sizeCircle1) / 2}
          onAnimationFinished={() =>
            currentRing === 0 ? setCurrentRing(1) : null
          }
          repeating={true}
          className={clsx(circle2ClassName,
            { 'opacity-5': currentRing !== 0 })}
          style={{
            left: `${size / 2}px`,
            top: `${size / 2}px`,
            position: 'absolute',
            translate: `-50% -50%`,
            zIndex: 9
          }}
        />
      ) : null}
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={sizeCircle1 - waveWidth}
          endInnerSize={sizeCircle2}
          width={waveWidth}
          repeating={true}
          className={clsx(waveBaseColor, `opacity-5`)}
          style={{
            left: `${size / 2}px`,
            top: `${size / 2}px`,
            position: 'absolute',
            translate: `-50% -50%`,
            zIndex: 9,
          }}
        />
      ) : null}
      <Circle
        radius={sizeCircle2 / 2}
        className={clsx(circle2ClassName,
          { 'opacity-20': currentRing < 1 },
          `absolute z-[8] -translate-y-1/2 -translate-x-1/2`)}
        style={{
          left: `${size / 2}px`,
          top: `${size / 2}px`
        }}
      />
      {currentRing === 1 ? (
        <AnimatedRing
          innerSize={sizeCircle2 - 1} // potentially harmful
          width={(sizeCircle3 - sizeCircle2) / 2}
          onAnimationFinished={() =>
            currentRing === 1 ? setCurrentRing(2) : null
          }
          repeating={true}
          className={clsx(circle3ClassName)}
          style={{
            left: `${size / 2}px`,
            top: `${size / 2}px`,
            position: 'absolute',
            translate: `-50% -50%`,
            zIndex: 7,
          }}
        />
      ) : null}
      {currentRing === 2 ? (
        <RingWave
          startInnerSize={sizeCircle2}
          endInnerSize={sizeCircle3 - waveWidth}
          width={waveWidth}
          repeating={true}
          className={clsx(waveBaseColor, `opacity-5`)}
          style={{
            left: `${size / 2}px`,
            top: `${size / 2}px`,
            position: 'absolute',
            translate: `-50% -50%`,
            zIndex: 7,
          }}
        />
      ) : null}
      <Circle
        radius={sizeCircle3 / 2}
        className={clsx(circle3ClassName,
          { 'opacity-20': currentRing < 2 },
          `absolute z-[6] -translate-y-1/2 -translate-x-1/2`)}
        style={{
          left: `${size / 2}px`,
          top: `${size / 2}px`
        }}
      />
    </div>
  )
}
