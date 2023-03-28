import { tw } from '@helpwave/common/twind/index'

export type ProgressIndicatorProps = {
  progress: number,
  strokeWidth?: number,
  size?: keyof typeof sizeMapping,
  direction?: 'clockwise' | 'counterclockwise',
  rotation?: number
}

const sizeMapping = { small: 16, medium: 24, big: 48 }

export const ProgressIndicator = ({ progress, strokeWidth = 4, size = 'small', direction = 'counterclockwise', rotation = 0 }: ProgressIndicatorProps) => {
  const currentSize = sizeMapping[size]
  const center = currentSize / 2
  const radius = center - strokeWidth / 2
  const arcLength = 2 * Math.PI * radius
  const arcOffset = arcLength * progress
  if (direction === 'clockwise') {
    rotation += 360 * progress
  }
  return (
    <svg className={tw(`h-[${currentSize}px] w-[${currentSize}px] transform rotate-[${rotation}deg]`)}>
      <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
        className={tw('stroke-hw-primary-400')}
      />
      <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
        strokeDasharray={arcLength} strokeDashoffset={arcOffset} className={tw('stroke-gray-300')}
      />
    </svg>
  )
}
