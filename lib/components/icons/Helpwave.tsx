import type { SVGProps } from 'react'
import { clsx } from 'clsx'

export type HelpwaveProps = SVGProps<SVGSVGElement> & {
  color?: string,
  animate?: 'none' | 'loading' | 'pulse' | 'bounce',
  size?: number,
}

/**
 * The helpwave loading spinner based on the svg logo.
 */
export const Helpwave = ({
  color = 'currentColor',
  animate = 'none',
  size = 64,
  ...props
}: HelpwaveProps) => {
  const isLoadingAnimation = animate === 'loading'
  let svgAnimationKey = ''

  if (animate === 'pulse') {
    svgAnimationKey = 'animate-pulse'
  } else if (animate === 'bounce') {
    svgAnimationKey = 'animate-bounce'
  }

  if (size < 0) {
    console.error('size cannot be less than 0')
    size = 64
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 888 888"
      fill="none"
      strokeLinecap="round"
      strokeWidth={48}
      {...props}
    >
      <g className={clsx(svgAnimationKey)}>
        <path className={clsx({ 'animate-wave-big-left-up': isLoadingAnimation })} d="M144 543.235C144 423.259 232.164 326 340.92 326" stroke={color} strokeDasharray="1000" />
        <path className={clsx({ 'animate-wave-big-right-down': isLoadingAnimation })} d="M537.84 544.104C429.084 544.104 340.92 446.844 340.92 326.869" stroke={color} strokeDasharray="1000" />
        <path className={clsx({ 'animate-wave-small-left-up': isLoadingAnimation })} d="M462.223 518.035C462.223 432.133 525.348 362.495 603.217 362.495" stroke={color} strokeDasharray="1000" />
        <path className={clsx({ 'animate-wave-small-right-down': isLoadingAnimation })} d="M745.001 519.773C666.696 519.773 603.218 450.136 603.218 364.233" stroke={color} strokeDasharray="1000" />
      </g>
    </svg>
  )
}
