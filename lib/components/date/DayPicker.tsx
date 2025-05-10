import type { WeekDay } from '../../util/date'
import { isInTimeSpan } from '../../util/date'
import { equalDate, getWeeksForCalenderMonth } from '../../util/date'
import { noop } from '../../util/noop'
import clsx from 'clsx'
import { useLocale } from '../../hooks/useLanguage'
import { useEffect, useState } from 'react'

export type DayPickerProps = {
  displayedMonth: Date,
  selected?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  weekStart?: WeekDay,
  markToday?: boolean,
  className?: string,
}

/**
 * A component for selecting a day of a month
 */
export const DayPicker = ({
  displayedMonth,
                            selected,
                            start,
                            end,
                            onChange = noop,
                            weekStart = 'monday',
                            markToday = true,
                            className = ''
                          }: DayPickerProps) => {
  const locale = useLocale()
  const month = displayedMonth.getMonth()
  const weeks = getWeeksForCalenderMonth(displayedMonth, weekStart)

  return (
    <div className={clsx('col gap-y-1 min-w-[220px] select-none', className)}>
      <div className="row text-center">
        {weeks[0]!.map((weekDay, index) => (
          <div key={index} className="flex-1 font-semibold">
            {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className="row text-center">
          {week.map((date) => {
            const isSelected = !!selected && equalDate(selected, date)
            const isToday = equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            const isDayValid = isInTimeSpan(date, start, end)
            return (
              <button
                disabled={!isDayValid}
                key={date.getDate()}
                className={clsx(
                  'flex-1 rounded-full border-2 border-transparent shadow-sm',
                  {
                    'text-gray-700 bg-gray-100': !isSameMonth && isDayValid,
                    'text-black bg-white': !isSelected && isSameMonth && isDayValid,
                    'text-on-primary bg-primary': isSelected,
                    'border-black': isToday && markToday,
                    'hover:brightness-90 hover:bg-primary hover:text-on-primary': isDayValid,
                    'text-disabled-text bg-disabled-background': !isDayValid
                  }
                )}
                onClick={() => onChange(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const DayPickerControlled = ({ displayedMonth, onChange = noop, ...restProps }: DayPickerProps) => {
  const [date, setDate] = useState(displayedMonth)

  useEffect(() => setDate(displayedMonth), [displayedMonth])

  return (
    <DayPicker
      displayedMonth={date}
      onChange={newDate => {
        setDate(newDate)
        onChange(newDate)
      }}
      {...restProps}
    />
  )
}
