import { CalendarDays } from 'lucide-react'
import clsx from 'clsx'
import { formatDate, formatDateTime } from '../../util/date'
import { noop } from '../../util/noop'
import { Input } from '../user-input/Input'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type DatePropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: Date,
  onChange?: (date: Date) => void,
  onEditComplete?: (value: Date) => void,
  type?: 'dateTime' | 'date',
}

/**
 * An Input for date properties
 */
export const DateProperty = ({
  value,
  onChange = noop,
  onEditComplete = noop,
  readOnly,
  type = 'dateTime',
  ...baseProps
}: DatePropertyProps) => {
  const hasValue = !!value

  const dateText = value ? (type === 'dateTime' ? formatDateTime(value) : formatDate(value)) : ''
  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<CalendarDays size={16}/>}
      input={({ softRequired }) => (
        <div
          className={clsx('row grow py-2 px-4 cursor-pointer', { 'text-warning': softRequired && !hasValue })}
        >
          <Input
            className={clsx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !shadow-none !w-fit !rounded-none', { 'bg-surface-warning': softRequired && !hasValue })}
            value={dateText}
            type={type === 'dateTime' ? 'datetime-local' : 'date'}
            readOnly={readOnly}
            onChange={(value, event) => {
              if (!event.target.value) {
                event.preventDefault()
                return
              }
              const dueDate = new Date(value)
              onChange(dueDate)
            }}
            onEditCompleted={(value) => onEditComplete(new Date(value))}
          />
        </div>
      )}
    />
  )
}
