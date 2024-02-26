import type { WeekDay } from '../../util/date'
import { addDuration, equalDate, subtractDuration, weekDayList } from '../../util/date'
import { noop } from '../../util/noop'
import { equalSizeGroups } from '../../util/array'
import { tw, tx } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

type DayPickerTranslation = {
  monday: string,
  tuesday: string,
  wednesday: string,
  thursday: string,
  friday: string,
  saturday: string,
  sunday: string
}

const defaultDayPickerTranslation: Record<Languages, DayPickerTranslation> = {
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  },
  de: {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  }
}

export type DayPickerProps = {
  value: Date,
  selected?: Date,
  onChange?: (date: Date) => void,
  weekStart?: WeekDay,
  markToday?: boolean,
  className?: string
}

/**
 * A component for selecting a day of a month
 */
export const DayPicker = ({
  language,
  value = new Date(),
  selected,
  onChange = noop,
  weekStart = 'monday',
  markToday = true,
  className = ''
}: PropsWithLanguage<DayPickerTranslation, DayPickerProps>) => {
  const translation = useTranslation(language, defaultDayPickerTranslation)
  const weekDayOrder = [...weekDayList.slice(weekDayList.indexOf(weekStart), weekDayList.length), ...weekDayList.slice(0, weekDayList.indexOf(weekStart))]

  const month = value.getMonth()
  const year = value.getFullYear()

  const dayList: Date[] = []
  let currentDate = new Date(year, month, 1) // Start of month
  const weekStartIndex = weekDayList.indexOf(weekStart)
  while (currentDate.getDay() !== weekStartIndex) {
    currentDate = subtractDuration(currentDate, { days: 1 })
  }

  while (currentDate.getMonth() !== (month + 1) % 12 || currentDate.getDay() !== weekStartIndex) {
    dayList.push(new Date(currentDate))
    currentDate = addDuration(currentDate, { days: 1 })
  }

  const weeks = equalSizeGroups(dayList, 7)
  return (
    <div className={tx('flex flex-col gap-y-1', className)}>
      <div className={tw('flex flex-row text-center')}>
        {weekDayOrder.map(weekDay => (
          <div key={weekDay} className={tw('flex-1 font-semibold')}>
            {translation[weekDay].substring(0, 2)}
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
                className={tx('flex-1 cursor-pointer rounded-md hover:bg-hw-primary-200 border border-2 hover:border-hw-primary-400',
                  {
                    'text-gray-500': date.getMonth() !== month,
                    'border-hw-primary-300 bg-hw-primary-100': isSelected,
                    'border-transparent': !isSelected && (!isToday || !markToday),
                    'border-gray-700': !selected && isToday && markToday
                  })}
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
