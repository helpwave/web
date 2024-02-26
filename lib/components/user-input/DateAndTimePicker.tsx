import type { ReactNode } from 'react'
import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import { tx, tw } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, monthsList, subtractDuration } from '../../util/date'
import { Button } from '../Button'
import { TimePicker } from '../date/TimePicker'
import { YearMonthPicker } from '../date/YearMonthPicker'
import { DayPicker } from '../date/DayPicker'

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

type DisplayMode = 'year' | 'month' | 'yearMonth' | 'day'

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
  const [displayMode, setDisplayMode] = useState<DisplayMode>('yearMonth')
  const [displayedMonth, setDisplayedMonth] = useState<Date>(value)

  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'

  let dateDisplay: ReactNode
  let timeDisplay: ReactNode
  if (useDate && displayMode === 'yearMonth') {
    dateDisplay = (
      <YearMonthPicker
        value={value}
        startYear={start}
        endYear={end}
        onChange={newDate => {
          onChange(newDate)
          setDisplayedMonth(newDate)
          setDisplayMode('day')
        }}
      />
    )
  }
  if (useDate && displayMode === 'day') {
    dateDisplay = (
      <DayPicker value={displayedMonth} selected={value}/>
    )
  }
  if (useTime) {
    timeDisplay = (<TimePicker time={value} onChange={console.log}/>)
  }

  return (
    <div className={tw('flex flex-col max-w-[500px]')}>
      <div className={tw('flex flex-row gap-x-4 justify-between max-h-[250px]')}>
        {dateDisplay && (
          <div className={tw('flex flex-col gap-y-2 max-w-[300px]')}>
            <div className={tw('flex flex-row justify-between')}>
              <div
                className={tx('flex flex-row gap-x-1 items-center', {
                  'text-gray-500 cursor-not-allowed': displayMode !== 'day',
                  'cursor-pointer': displayMode === 'day'
                })}
                onClick={displayMode === 'day' ? () => setDisplayMode('yearMonth') : undefined}
              >
                {`${translation[monthsList[value.getMonth()!]!]} ${value.getFullYear()}`}
                <ChevronDown size={16}/>
              </div>
              {displayMode === 'day' && (
                <div className={tx('flex flex-row gap-x-2')}>
                  <ArrowUp
                    className={tw('cursor-pointer')}
                    size={20}
                    onClick={() => {
                      setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
                    }}
                  />
                  <ArrowDown
                    className={tw('cursor-pointer')}
                    size={20}
                    onClick={() => {
                      setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
                    }}
                  />
                </div>
              )}
            </div>
            <div className={tw('overflow-auto')}>
              {dateDisplay}
            </div>
          </div>
        )}
        {timeDisplay}
      </div>
      <div className={tw('flex flex-row justify-end')}>
        <div className={tw('flex flex-row gap-x-2 mt-4')}>
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
