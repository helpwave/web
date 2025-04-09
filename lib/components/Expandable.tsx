import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

export type ExpandableProps = PropsWithChildren<{
  label: ReactNode,
  icon?: (expanded: boolean) => ReactNode,
  initialExpansion?: boolean,
  /**
   * Whether the expansion should only happen when the header is clicked or on the entire component
   */
  clickOnlyOnHeader?: boolean,
  className?: string,
  headerClassName?: string,
}>

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
  const [expanded, setExpanded] = useState(initialExpansion)
  icon ??= expanded1 => expanded1 ? <ChevronUp size={16} className={clsx('min-w-[16px]')}/> : <ChevronDown size={16} className={clsx('min-w-[16px]')}/>

  return (
    <div
      ref={ref}
      className={clsx('flex flex-col', { 'cursor-pointer': !clickOnlyOnHeader }, className)}
      onClick={() => !clickOnlyOnHeader && setExpanded(!expanded)}
    >
      <div
        className={clsx('flex flex-row justify-between items-center cursor-pointer gap-x-2', headerClassName)}
        onClick={() => clickOnlyOnHeader && setExpanded(!expanded)}
      >
        {label}
        {icon(expanded)}
      </div>
      {expanded && (
        <div className={clsx('flex flex-col')}>
          {children}
        </div>
      )}
    </div>
  )
})

Expandable.displayName = 'Expandable'
