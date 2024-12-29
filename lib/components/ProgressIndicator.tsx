import type { PropsWithChildren } from 'react'
import { tw } from '../twind'

export type ProgressIndicatorProps = PropsWithChildren<{
  /*
    The amount of progress that has been made
    Value form 0 to 1
   */
  progress: number,
  strokeWidth?: number,
  size?: keyof typeof sizeMapping,
  direction?: 'clockwise' | 'counterclockwise',
  /*
    Rotation of the starting point of the indicator
    default start at 3 o'clock
    Given in degree
   */
  rotation?: number
}>

const sizeMapping = { small: 16, medium: 24, big: 48 }

/**
 * A progress indicator
 *
 * Start rotation is 3 o'clock and fills counterclockwise
 *
 * Progress is given from 0 to 1
 */
export const ProgressIndicator = ({
  progress,
  strokeWidth = 5,
  size = 'medium',
  direction = 'counterclockwise',
  rotation = 0,
  children,
}: ProgressIndicatorProps) => {
  const currentSize = sizeMapping[size]
  const center = currentSize / 2
  const radius = center - strokeWidth / 2
  const arcLength = 2 * Math.PI * radius
  const arcOffset = arcLength * progress
  if (direction === 'clockwise') {
    rotation += 360 * progress
  }
  return (
    <div className={tw(`min-h-[${currentSize}px] min-w-[${currentSize}px] relative`)}>
      <svg className={tw(`absolute h-[${currentSize}px] w-[${currentSize}px] transform rotate-[${rotation}deg]`)}>
        <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
                className={tw('stroke-hw-primary-400')}
        />
        <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
                strokeDasharray={arcLength} strokeDashoffset={arcOffset} className={tw('stroke-gray-300')}
        />
      </svg>
      <div className={tw('absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2')}>{children}</div>
    </div>
  )
}
