export type VerticalDividerProps = {
  width?: number,
  height?: number,
  dashDistance?: number,
  dashWidth?: number,
}

/**
 * A Component for creating a vertical Divider
 */
export const VerticalDivider = ({
                                  width = 1,
                                  height = 100,
                                  dashDistance = 4,
                                  dashWidth = 0.5,
                                }: VerticalDividerProps) => {
  const colorString = '000000'

  return (
    <div style={{ width: width + 'px', height: height + 'px' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <line
          opacity="0.5"
          x1={width / 2}
          y1={height}
          x2={width / 2}
          y2="0"
          stroke="url(#paint_linear)"
          strokeWidth="2"
          strokeDasharray={`${dashWidth} ${dashDistance}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint_linear"
            x1={width / 2}
            y1="0"
            x2={width / 2}
            y2={height}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={colorString} stopOpacity="0"/>
            <stop offset="0.5" stopColor={colorString}/>
            <stop offset="1" stopColor={colorString} stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
