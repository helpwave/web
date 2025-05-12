import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, subtractDuration } from '../../util/date'
import { SolidButton } from '../Button'
import type { TimePickerProps } from '../date/TimePicker'
import { TimePicker } from '../date/TimePicker'
import type { DatePickerProps } from '../date/DatePicker'
import { DatePicker } from '../date/DatePicker'

type TimeTranslation = {
  clear: string,
  change: string,
  year: string,
  month: string,
  day: string,
  january: string,
  february: string,
  march: string,
  april: string,
  may: string,
  june: string,
  july: string,
  august: string,
  september: string,
  october: string,
  november: string,
  december: string,
}

const defaultTimeTranslation: Record<Languages, TimeTranslation> = {
  en: {
    clear: 'Clear',
    change: 'Change',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    january: 'January',
    february: 'Febuary',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
  de: {
    clear: 'Entfernen',
    change: 'Ändern',
    year: 'Jahr',
    month: 'Monat',
    day: 'Tag',
    january: 'Januar',
    february: 'Febuar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  }
}

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

export type DateTimePickerProps = {
  mode?: DateTimePickerMode,
  value?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  onFinish?: (date: Date) => void,
  onRemove?: () => void,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'maxHeight'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
  overwriteTranslation,
  value = new Date(),
  start = subtractDuration(new Date(), { years: 50 }),
  end = addDuration(new Date(), { years: 50 }),
  mode = 'dateTime',
  onFinish = noop,
  onChange = noop,
  onRemove = noop,
  timePickerProps,
  datePickerProps,
}: PropsForTranslation<TimeTranslation, DateTimePickerProps>) => {
  const translation = useTranslation(defaultTimeTranslation, overwriteTranslation)

  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'

  let dateDisplay: ReactNode
  let timeDisplay: ReactNode

  if (useDate) {
    dateDisplay = (
      <DatePicker
        {...datePickerProps}
        className="min-w-[320px] min-h-[250px]"
        yearMonthPickerProps={{ maxHeight: 218 }}
        value={value}
        start={start}
        end={end}
        onChange={onChange}
      />
    )
  }
  if (useTime) {
    timeDisplay = (
      <TimePicker
        {...timePickerProps}
        className={clsx('h-full', { 'justify-between w-full': mode === 'time' })}
        maxHeight={250}
        time={value}
        onChange={onChange}
      />
    )
  }

  return (
    <div className="col w-fit">
      <div className="row gap-x-4">
        {dateDisplay}
        {timeDisplay}
      </div>
      <div className="row justify-end">
        <div className="row gap-x-2 mt-1">
          <SolidButton size="medium" color="negative" onClick={onRemove}>{translation.clear}</SolidButton>
          <SolidButton
            size="medium"
            onClick={() => onFinish(value)}
          >
            {translation.change}
          </SolidButton>
        </div>
      </div>
    </div>
  )
}
