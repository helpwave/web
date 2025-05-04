import type { WeekDay } from '../../util/date'
import { equalDate, getWeeksForCalenderMonth } from '../../util/date'
import { noop } from '../../util/noop'
import clsx from 'clsx'
import { useLocale } from '../../hooks/useLanguage'

export type DayPickerProps = {
  value: Date,
  selected?: Date,
  onChange?: (date: Date) => void,
  weekStart?: WeekDay,
  markToday?: boolean,
  className?: string,
}

/**
 * A component for selecting a day of a month
 */
export const DayPicker = ({
  value = new Date(),
  selected,
  onChange = noop,
  weekStart = 'monday',
  markToday = true,
  className = ''
}: DayPickerProps) => {
  const locale = useLocale()
  const month = value.getMonth()
  const weeks = getWeeksForCalenderMonth(value, weekStart)

  return (
    <div className={clsx('flex flex-col gap-y-1 min-w-[220px] select-none', className)}>
      <div className={clsx('flex flex-row text-center')}>
        {weeks[0]!.map((weekDay, index) => (
          <div key={index} className={clsx('flex-1 font-semibold')}>
            {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className={clsx('flex flex-row text-center gap-x-2')}>
          {week.map((date) => {
            const isSelected = !!selected && equalDate(selected, date)
            const isToday = equalDate(new Date(), date)
            const isSameMonth = date.getMonth() === month
            return (
              <div
                key={date.getDate()}
                className={clsx(
                  'flex-1 cursor-pointer rounded-full border-2 border-transparent hover:bg-primary hover:text-on-primary',
                  {
                    'text-black bg-gray-200': !isSameMonth,
                    'text-on-primary bg-primary/40': isSelected,
                    'text-black bg-white': !isSelected && isSameMonth,
                    'border-black': isToday && markToday
                  }
                )}
                onClick={() => onChange(date)}
              >
                {date.getDate()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
