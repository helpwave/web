import type { WeekDay } from '../../util/date'
import { equalDate, getWeeksForCalenderMonth } from '../../util/date'
import { noop } from '../../util/noop'
import { tw, tx } from '@helpwave/color-themes/twind'
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
    <div className={tx('flex flex-col gap-y-1 min-w-[220px] select-none', className)}>
      <div className={tw('flex flex-row text-center')}>
        {weeks[0]!.map((weekDay, index) => (
          <div key={index} className={tw('flex-1 font-semibold')}>
            {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className={tw('flex flex-row text-center gap-x-2')}>
          {week.map((date) => {
            const isSelected = !!selected && equalDate(selected, date)
            const isToday = equalDate(new Date(), date)
            return (
              <div
                key={date.getDate()}
                className={tx(
                  'flex-1 cursor-pointer rounded-md hover:bg-hw-primary-200 border border-2 hover:border-hw-primary-400',
                  {
                    'text-gray-400': date.getMonth() !== month,
                    'border-hw-primary-300 bg-hw-primary-100': isSelected,
                    'border-transparent': !isSelected && (!isToday || !markToday),
                    'border-gray-700': !selected && isToday && markToday
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
