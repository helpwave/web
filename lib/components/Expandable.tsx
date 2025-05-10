import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

type IconBuilder = (expanded: boolean) => ReactNode

export type ExpandableProps = PropsWithChildren<{
  label: ReactNode,
  icon?: IconBuilder,
  initialExpansion?: boolean,
  /**
   * Whether the expansion should only happen when the header is clicked or on the entire component
   */
  clickOnlyOnHeader?: boolean,
  className?: string,
  headerClassName?: string,
}>

const DefaultIcon: IconBuilder = (expanded) => expanded ?
  (<ChevronUp size={16} className="min-w-[16px]"/>)
  : (<ChevronDown size={16} className="min-w-[16px]"/>)

/**
 * A Component for showing and hiding content
 */
export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(({
                                                                         children,
                                                                         label,
                                                                         icon,
                                                                         initialExpansion = false,
                                                                         clickOnlyOnHeader = true,
                                                                         className = '',
                                                                         headerClassName = ''
                                                                       }, ref) => {
  const [isExpanded, setIsExpanded] = useState(initialExpansion)
  icon ??= DefaultIcon

  return (
    <div
      ref={ref}
      className={clsx('col bg-surface text-on-surface group rounded-lg shadow-sm', { 'cursor-pointer': !clickOnlyOnHeader }, className)}
      onClick={() => !clickOnlyOnHeader && setIsExpanded(!isExpanded)}
    >
      <button
        className={clsx('btn-md rounded-lg justify-between items-center bg-surface text-on-surface', { 'group-hover:brightness-95': !isExpanded }, headerClassName)}
        onClick={() => clickOnlyOnHeader && setIsExpanded(!isExpanded)}
      >
        {label}
        {icon(isExpanded)}
      </button>
      {isExpanded && (
        <div className="col">
          {children}
        </div>
      )}
    </div>
  )
})

Expandable.displayName = 'Expandable'
