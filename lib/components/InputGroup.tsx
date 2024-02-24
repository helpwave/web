import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tx, tw } from '../twind'
import { Span } from './Span'

export type InputGroupProps = {
  inputs: ReactNode[],
  title: string,
  expanded?: boolean,
  isExpandable?: boolean,
  className?: string
}

/**
 * A Component for layouting inputs in an expandable group
 */
export const InputGroup = ({
  inputs,
  title,
  expanded = true,
  isExpandable = false,
  className = '',
}: InputGroupProps) => {
  // if not expandable always be expanded, else use expanded value
  const [isExpanded, setIsExpanded] = useState<boolean>(!isExpandable || expanded)

  useEffect(() => {
    if (!isExpandable) {
      setIsExpanded(true)
    } else if (expanded !== isExpanded) {
      setIsExpanded(expanded)
    }
  }, [expanded, isExpandable])

  return (
    <div className={tx('p-4 flex flex-col gap-y-4', className)}>
      <div className={tw('flex flex-row justify-between items-center text-hw-primary-400')}>
        <Span type="title">{title}</Span>
        {isExpandable && (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={tw('bg-hw-primary-400 rounded-full text-white w-6 h-6')}
          >
            {isExpanded ?
                <ChevronUp className={tw('-translate-y-[1px]')} size={24} />
              : <ChevronDown className={tw('translate-y-[1px]')} size={24} />
            }
          </div>
        )}
      </div>
      <div className={tx('flex flex-col gap-y-2', { 'h-full': isExpanded, 'h-0 overflow-hidden': !isExpanded })}>
        {inputs}
      </div>
    </div>
  )
}
