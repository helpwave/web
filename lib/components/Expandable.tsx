import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tw, tx } from '../twind'

export type ExpandableProps = PropsWithChildren<{
  label: ReactNode,
  icon?: (expanded: boolean) => ReactNode,
  initialExpansion?: boolean,
  className?: string,
  ref?: React.Ref<HTMLDivElement>
}>

/**
 * A Component for showing and hiding content
 */
export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(({
  children,
  label,
  icon,
  initialExpansion = false,
  className = '',
}, ref) => {
  const [expanded, setExpanded] = useState(initialExpansion)
  icon ??= expanded1 => expanded1 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>

  return (
    <div ref={ref} className={tx('flex flex-col', className)}>
      <div
        className={tw('flex flex-row justify-between items-center cursor-pointer')}
        onClick={() => setExpanded(!expanded)}
      >
        {label}
        {icon(expanded)}
      </div>
      <div className={tx('flex flex-col', { 'h-full': expanded, 'h-0 overflow-hidden': !expanded })}>
        {children}
      </div>
    </div>
  )
})

Expandable.displayName = 'Expandable'
