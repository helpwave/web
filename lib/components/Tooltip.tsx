import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { useHoverState } from '../hooks/useHoverState'
import { clsx } from 'clsx'

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
                        }: TooltipProps) => {
  const { isHovered, handlers } = useHoverState()

  const positionClasses = {
    top: `bottom-full left-1/2 -translate-x-1/2 mb-[6px]`,
    bottom: `top-full left-1/2 -translate-x-1/2 mt-[6px]`,
    left: `right-full top-1/2 -translate-y-1/2 mr-[6px]`,
    right: `left-full top-1/2 -translate-y-1/2 ml-[6px]`
  }

  const triangleSize = 6
  const triangleClasses = {
    top: `top-full left-1/2 -translate-x-1/2 border-t-gray-600 border-l-transparent border-r-transparent`,
    bottom: `bottom-full left-1/2 -translate-x-1/2 border-b-gray-600 border-l-transparent border-r-transparent`,
    left: `left-full top-1/2 -translate-y-1/2 border-l-gray-600 border-t-transparent border-b-transparent`,
    right: `right-full top-1/2 -translate-y-1/2 border-r-gray-600 border-t-transparent border-b-transparent`
  }

  const triangleStyle: Record<Position, CSSProperties> = {
    top: { borderWidth: `${triangleSize}px ${triangleSize}px 0 ${triangleSize}px` },
    bottom: { borderWidth: `0 ${triangleSize}px ${triangleSize}px ${triangleSize}px` },
    left: { borderWidth: `${triangleSize}px 0 ${triangleSize}px ${triangleSize}px` },
    right: { borderWidth: `${triangleSize}px ${triangleSize}px ${triangleSize}px 0` }
  }

  return (
    <div
      className={clsx('relative inline-block', containerClassName)}
      {...handlers}
    >
      {children}
      {isHovered && (
        <div
          className={clsx(`opacity-0 absolute text-black text-xs font-semibold text-gray-600 px-2 py-1 rounded whitespace-nowrap border-2 border-gray-600
           animate-tooltip-fade-in shadow-lg bg-gray-100`, positionClasses[position], tooltipClassName)}
          style={{ zIndex, animationDelay: animationDelay + 'ms' }}
        >
          {tooltip}
          <div
            className={clsx(`absolute w-0 h-0`, triangleClasses[position])}
            style={{ ...triangleStyle[position], zIndex }}
           />
        </div>
      )}
    </div>
  )
}
