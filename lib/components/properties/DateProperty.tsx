import { CalendarDays } from 'lucide-react'
import { tx } from '../../twind'
import { formatDate } from '../../util/date'
import { noop } from '../../util/noop'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type DatePropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  date?: Date,
  onChange?: (date: Date) => void
}

/**
 * An Input for date properties
 */
export const DateProperty = ({
  date,
  onChange = noop,
  readOnly,
  ...baseProps
}: DatePropertyProps) => {
  const hasValue = !!date

  const dateText = date ? formatDate(date) : ''
  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<CalendarDays size={16}/>}
      input={({ softRequired }) => (
        <div
          className={tx('flex flex-row grow py-2 px-4 cursor-pointer', { 'text-hw-warn-600': softRequired && !hasValue })}
        >
          <input
            className={tx('!ring-0 !border-0 !outline-0 !p-0 !m-0', { 'bg-hw-warn-200': softRequired && !hasValue })}
            value={dateText}
            type="datetime-local"
            readOnly={readOnly}
            onChange={(event) => {
              if (!event.target.value) {
                event.preventDefault()
                return
              }
              const dueDate = new Date(event.target.value)
              onChange(dueDate)
            }}
          />
        </div>
      )}
    />
  )
}
