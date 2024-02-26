import type { ReactNode } from 'react'
import { useState } from 'react'
import { tw, tx } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, subtractDuration } from '../../util/date'
import { Button } from '../Button'
import { TimePicker } from '../date/TimePicker'
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
  december: string
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
  onRemove?: () => void
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
  language,
  value = new Date(),
  start = subtractDuration(new Date(), { years: 50 }),
  end = addDuration(new Date(), { years: 50 }),
  mode = 'dateTime',
  onFinish = noop,
  onChange = noop,
  onRemove = noop
}: PropsWithLanguage<TimeTranslation, DateTimePickerProps>) => {
  const translation = useTranslation(language, defaultTimeTranslation)
  const [date, setDate] = useState<Date>(value)

  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'

  let dateDisplay: ReactNode
  let timeDisplay: ReactNode

  if (useDate) {
    dateDisplay = (
      <DatePicker
        yearMonthPickerProps={{ maxHeight: 218 }}
        value={date}
        start={start}
        end={end}
        onChange={date1 => {
          setDate(date1)
          onChange(date1)
        }}
      />
    )
  }
  if (useTime) {
    timeDisplay = (
      <TimePicker
        className={tx({ 'justify-between w-full': mode === 'time' })}
        maxHeight={250}
        time={date}
        onChange={date1 => {
          setDate(date1)
          onChange(date1)
        }}
      />
    )
  }

  return (
    <div className={tw('flex flex-col w-fit')}>
      <div className={tw('flex flex-row gap-x-4')}>
        {dateDisplay}
        {timeDisplay}
      </div>
      <div className={tw('flex flex-row justify-end')}>
        <div className={tw('flex flex-row gap-x-2 mt-1')}>
          <Button size="medium" color="negative" onClick={onRemove}>{translation.clear}</Button>
          <Button
            size="medium"
            onClick={() => onFinish(value)}
          >
            {translation.change}
          </Button>
        </div>
      </div>
    </div>
  )
}
