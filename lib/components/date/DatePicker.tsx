import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, monthsList, subtractDuration } from '../../util/date'
import { tw, tx } from '../../twind'
import { Button } from '../Button'
import type { YearMonthPickerProps } from './YearMonthPicker'
import { YearMonthPicker } from './YearMonthPicker'
import type { DayPickerProps } from './DayPicker'
import { DayPicker } from './DayPicker'

type DatePickerTranslation = {
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
  today: string
}

const defaultDatePickerTranslation: Record<Languages, DatePickerTranslation> = {
  en: {
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
    today: 'Today',
  },
  de: {
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
    today: 'Heute',
  }
}

type DisplayMode = 'yearMonth' | 'day'

export type DatePickerProps = {
  value?: Date,
  start?: Date,
  end?: Date,
  initialDisplay?: DisplayMode,
  onChange?: (date: Date) => void,
  dayPickerProps?: Omit<DayPickerProps, 'value' | 'onChange' | 'selected'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'value' | 'onChange' | 'startYear' | 'endYear'>,
  className?: string
}

/**
 * A Component for picking a date
 */
export const DatePicker = ({
  language,
  value = new Date(),
  start = subtractDuration(new Date(), { years: 50 }),
  end = addDuration(new Date(), { years: 50 }),
  initialDisplay = 'day',
  onChange = noop,
  yearMonthPickerProps,
  dayPickerProps,
  className = ''
}: PropsWithLanguage<DatePickerTranslation, DatePickerProps>) => {
  const translation = useTranslation(language, defaultDatePickerTranslation)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(value)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

  useEffect(() => {
    setDisplayedMonth(value)
  }, [value])

  return (
    <div className={tx('flex flex-col gap-y-2', className)}>
      <div className={tw('flex flex-row justify-between')}>
        <div
          className={tx('flex flex-row gap-x-1 items-center cursor-pointer select-none flex-[6]', {
            'text-gray-500': displayMode !== 'day',
          })}
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${translation[monthsList[displayedMonth.getMonth()!]!]} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </div>
        {displayMode === 'day' && (
          <div className={tx('flex flex-row gap-x-2 flex-1 items-center justify-center')}>
            <ArrowUp
              className={tw('cursor-pointer bg-gray-200 hover:bg-gray-300 w-5 h-5 rounded-full')}
              size={20}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            />
            <ArrowDown
              className={tw('cursor-pointer bg-gray-200 hover:bg-gray-300 w-5 h-5 rounded-full')}
              size={20}
              onClick={() => {
                setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
              }}
            />
          </div>
        )}
      </div>
      {displayMode === 'yearMonth' ? (
        <YearMonthPicker
          {...yearMonthPickerProps}
          value={value}
          startYear={start}
          endYear={end}
          onChange={newDate => {
            onChange(newDate)
            setDisplayedMonth(newDate)
            setDisplayMode('day')
          }}
        />
      ) : (
        <div>
          <DayPicker
            {...dayPickerProps}
            value={displayedMonth}
            selected={value}
            onChange={date => {
              onChange(date)
            }}
          />
          <div className={tw('mt-1')}>
            <Button
              variant="textButton"
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                onChange(newDate)
              }}
              className={tw('!p-0')}
            >
              {translation.today}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
