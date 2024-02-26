import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { tx, tw } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, subtractDuration } from '../../util/date'
import { Expandable } from '../Expandable'
import { Span } from '../Span'

const monthsList = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const
export type Month = typeof monthsList[number]

type DateAndTimePickerTranslation = {
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

const defaultDateAndTimePickerTranslation: Record<Languages, DateAndTimePickerTranslation> = {
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
    december: 'December'
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
    december: 'December'
  }
}

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

type DisplayMode = 'year' | 'month' | 'yearMonth' | 'day'

type DateTimeType = {
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number
}

type YearMonth = {
  year: number,
  month: number
}

type YearMonthDisplayProps = {
  value?: YearMonth,
  startYear: number,
  endYear: number,
  onChange?: (yearMonth: YearMonth) => void
}
const YearMonthDisplay = ({
  language,
  value,
  startYear,
  endYear,
  onChange = noop
}: PropsWithLanguage<DateAndTimePickerTranslation, YearMonthDisplayProps>) => {
  const translation = useTranslation(language, defaultDateAndTimePickerTranslation)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToItem = () => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }

    scrollToItem()
  }, [ref])

  if (endYear < startYear) {
    console.error(`startYear: (${startYear}) less than endYear: (${endYear})`)
    return null
  }

  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => index + startYear)

  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-col gap-y-1')}>
        {years.map(year => {
          const selectedYear = value?.year === year
          return (
            <Expandable
              key={year}
              ref={(value?.year ?? new Date().getFullYear()) === year ? ref : undefined}
              label={<Span className={tx({ '!text-hw-primary-400 font-bold': selectedYear })}>{year}</Span>}
            >
              <div className={tw('flex flex-wrap')}>
                {monthsList.map(month => {
                  const monthIndex = monthsList.indexOf(month)
                  const selectedMonth = selectedYear && monthIndex === value?.month
                  return (
                    <div
                      key={month}
                      className={tx('px-2 py-1 rounded-md border border-1 hover:bg-hw-primary-200 w-1/4 text-center cursor-pointer',
                        { 'bg-white': !selectedMonth, 'bg-hw-primary-100 hover:bg-hw-primary-200': selectedMonth })}
                      onClick={() => onChange({ year, month: monthIndex })}
                    >
                      <Span className={tx({ '!text-hw-primary-400': selectedMonth })}>{translation[month]}</Span>
                    </div>
                  )
                })}
              </div>
            </Expandable>
          )
        })}
      </div>
    </div>
  )
}

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
}: PropsWithLanguage<DateAndTimePickerTranslation, DateTimePickerProps>) => {
  const translation = useTranslation(language, defaultDateAndTimePickerTranslation)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('yearMonth')
  const [currentInput, setCurrentInput] = useState<DateTimeType>({
    year: value?.getFullYear(),
    month: value?.getMonth(),
    day: value?.getDate(),
    hour: value?.getHours(),
    minute: value?.getMinutes(),
  })

  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'

  let dateDisplay: ReactNode
  let timeDisplay: ReactNode
  if (useDate && displayMode === 'yearMonth') {
    dateDisplay = (
      <YearMonthDisplay
        value={currentInput.year && currentInput.month ? {
          year: currentInput.year,
          month: currentInput.month
        } : undefined}
        startYear={start.getFullYear()}
        endYear={end.getFullYear()}
        onChange={yearMonth => {
          const newInput = { ...currentInput, ...yearMonth }
          const newDate = new Date(newInput.year, newInput.month, newInput.day, newInput.hour, newInput.minute)
          onChange(newDate)
          setCurrentInput(newInput)
          setDisplayMode('day')
        }}
      />
    )
  }
  return (
    <div className={tw('flex flex-row max-w-[500px] max-h-[300px]')}>
      {dateDisplay}
      {timeDisplay}
    </div>
  )
}
