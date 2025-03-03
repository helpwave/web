import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { tx } from '@helpwave/color-themes/twind'
import { useHoverState } from '../hooks/useHoverState'

type Position = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = PropsWithChildren<{
  tooltip: string | ReactNode,
  /**
   * Number of milliseconds until the tooltip appears
   *
   * defaults to 1000ms
   */
  animationDelay?: number,
  /**
   * Class names of additional styling properties for the tooltip
   */
  tooltipClassName?: string,
  /**
   * Class names of additional styling properties for the container from which the tooltip will be created
   */
  containerClassName?: string,
  position?: Position,
  zIndex?: number,
  offset?: number,
}>

/**
 * A Component for showing a tooltip when hovering over Content
 * @param tooltip The tooltip to show can be a text or any ReactNode
 * @param children The Content for which the tooltip should be created
 * @param animationDelay The delay before the tooltip appears
 * @param tooltipClassName Additional ClassNames for the Container of the tooltip
 * @param containerClassName Additional ClassNames for the Container holding the content
 * @param position The direction of the tooltip relative to the Container
 * @param zIndex The z Index of the tooltip (you may require this when stacking modals)
 * @param offset The distance to the parent container in pixels
 * @constructor
 */
export const Tooltip = ({
  tooltip,
  children,
  animationDelay = 650,
  tooltipClassName = '',
  containerClassName = '',
  position = 'bottom',
  zIndex = 10,
  offset = 6,
}: TooltipProps) => {
  const { isHovered, handlers } = useHoverState()

  const positionClasses = {
    top: `bottom-full left-1/2 -translate-x-1/2 mb-[${offset}px]`,
    bottom: `top-full left-1/2 -translate-x-1/2 mt-[${offset}px]`,
    left: `right-full top-1/2 -translate-y-1/2 mr-[${offset}px]`,
    right: `left-full top-1/2 -translate-y-1/2 ml-[${offset}px]`
  }

  const backgroundColor = 'gray-100'
  const borderColor = 'gray-600'

  const triangleSize = 6
  const triangleClasses = {
    top: `top-full left-1/2 -translate-x-1/2 border-t-${borderColor} border-l-transparent border-r-transparent`,
    bottom: `bottom-full left-1/2 -translate-x-1/2 border-b-${borderColor} border-l-transparent border-r-transparent`,
    left: `left-full top-1/2 -translate-y-1/2 border-l-${borderColor} border-t-transparent border-b-transparent`,
    right: `right-full top-1/2 -translate-y-1/2 border-r-${borderColor} border-t-transparent border-b-transparent`
  }

  const triangleStyle: Record<Position, CSSProperties> = {
    top: { borderWidth: `${triangleSize}px ${triangleSize}px 0 ${triangleSize}px` },
    bottom: { borderWidth: `0 ${triangleSize}px ${triangleSize}px ${triangleSize}px` },
    left: { borderWidth: `${triangleSize}px 0 ${triangleSize}px ${triangleSize}px` },
    right: { borderWidth: `${triangleSize}px ${triangleSize}px ${triangleSize}px 0` }
  }

  return (
    <div
      className={tx(`relative inline-block`, containerClassName)}
      {...handlers}
    >
      {children}
      {isHovered && (
        <div
          className={tx(`opacity-0 absolute z-[${zIndex}] text-black text-xs font-semibold text-[${borderColor}] px-2 py-1 rounded whitespace-nowrap border-2 border-${borderColor}
           animate-tooltip-fade-in animation-delay-${animationDelay} shadow-lg bg-${backgroundColor}`, positionClasses[position], tooltipClassName)}
        >
          {tooltip}
          <div className={tx(`absolute w-0 h-0 z-[${zIndex}]`, triangleClasses[position])} style={triangleStyle[position]}/>
        </div>
      )}
    </div>
  )
}
