export type ProgressIndicatorProps = {
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
  rotation?: number,
}

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
                                    rotation = 0
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
    <svg
      style={{
        height: `${currentSize}px`,
        width: `${currentSize}px`,
        transform: `rotate(${rotation}deg)`
      }}
    >
      <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
              className="stroke-primary"
      />
      <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={strokeWidth}
              strokeDasharray={arcLength} strokeDashoffset={arcOffset} className="stroke-gray-300"
      />
    </svg>
  )
}
