import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import { noop } from '../util/noop'

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
    <div className={clsx('col gap-y-4 p-4 bg-white rounded-xl', className)}>
      <div
        className={clsx('row justify-between items-center', {
          'cursor-pointer': isExpandable && !disabled,
          'cursor-not-allowed': disabled,
        },
        {
          'text-primary': !disabled,
          'text-primary/40': disabled
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
        <span className="textstyle-title-md">{title}</span>
        <div className={clsx('rounded-full text-white w-6 h-6', {
          'bg-primary': (isExpandable && !disabled) || expanded,
          'bg-primary/40': disabled,
        })}>
          {isExpanded
            ? <ChevronUp className="-translate-y-[1px]" size={24}/>
            : <ChevronDown className="translate-y-[1px]" size={24}/>
          }
        </div>
      </div>
      {isExpanded && (
        <div className="col gap-y-2 h-full">
          {children}
        </div>
      )}
    </div>
  )
}
