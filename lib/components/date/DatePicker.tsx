import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, subtractDuration } from '../../util/date'
import { tw, tx } from '../../twind'
import { Button } from '../Button'
import { useLocale } from '../../hooks/useLanguage'
import type { YearMonthPickerProps } from './YearMonthPicker'
import { YearMonthPicker } from './YearMonthPicker'
import type { DayPickerProps } from './DayPicker'
import { DayPicker } from './DayPicker'

type DatePickerTranslation = {
  today: string
}

const defaultDatePickerTranslation: Record<Languages, DatePickerTranslation> = {
  en: {
    today: 'Today',
  },
  de: {
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
  const locale = useLocale()
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
          {`${new Intl.DateTimeFormat(locale, { month: 'long' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
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
