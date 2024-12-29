import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tx, tw } from '../twind'
import { noop } from '../util/noop'
import { Span } from './Span'

export type InputGroupProps = PropsWithChildren<{
  title: string,
  expanded?: boolean,
  isExpandable?: boolean,
  disabled?: boolean,
  onChange?: (value: boolean) => void,
  className?: string,
}>

/**
 * A Component for layouting inputs in an expandable group
 */
export const InputGroup = ({
  children,
  title,
  expanded = true,
  isExpandable = true,
  disabled = false,
  onChange = noop,
  className = '',
}: InputGroupProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded)

  useEffect(() => {
    setIsExpanded(expanded)
  }, [expanded])

  return (
    <div className={tx('p-4 flex flex-col gap-y-4 bg-white rounded-xl', className)}>
      <div
        className={tx('flex flex-row justify-between items-center', {
          'cursor-pointer': isExpandable && !disabled,
          'cursor-not-allowed': disabled,
        },
        {
          'text-hw-primary-400': !disabled,
          'text-hw-primary-200': disabled
        })}
        onClick={() => {
          if (!isExpandable) {
            return
          }
          const updatedIsExpanded = !isExpanded
          onChange(updatedIsExpanded)
          setIsExpanded(updatedIsExpanded)
        }}
      >
        <Span type="title">{title}</Span>
        <div className={tx('rounded-full text-white w-6 h-6', {
          'bg-hw-primary-400': (isExpandable && !disabled) || expanded,
          'bg-hw-primary-200': disabled,
        })}>
          {isExpanded
            ? <ChevronUp className={tw('-translate-y-[1px]')} size={24}/>
            : <ChevronDown className={tw('translate-y-[1px]')} size={24}/>
          }
        </div>
      </div>
      {isExpanded && (
        <div className={tx('flex flex-col gap-y-2 h-full')}>
          {children}
        </div>
      )}
    </div>
  )
}
