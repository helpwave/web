import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, isInTimeSpan, subtractDuration } from '../../util/date'
import clsx from 'clsx'
import { SolidButton, TextButton } from '../Button'
import { useLocale } from '../../hooks/useLanguage'
import type { YearMonthPickerProps } from './YearMonthPicker'
import { YearMonthPicker } from './YearMonthPicker'
import type { DayPickerProps } from './DayPicker'
import { DayPicker } from './DayPicker'

type DatePickerTranslation = {
  today: string,
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
  dayPickerProps?: Omit<DayPickerProps, 'displayedMonth' | 'onChange' | 'selected'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'displayedYearMonth' | 'onChange' | 'start' | 'end'>,
  className?: string,
}

/**
 * A Component for picking a date
 */
export const DatePicker = ({
                             overwriteTranslation,
                             value = new Date(),
                             start = subtractDuration(new Date(), { years: 50 }),
                             end = addDuration(new Date(), { years: 50 }),
                             initialDisplay = 'day',
                             onChange = noop,
                             yearMonthPickerProps,
                             dayPickerProps,
                             className = ''
                           }: PropsForTranslation<DatePickerTranslation, DatePickerProps>) => {
  const locale = useLocale()
  const translation = useTranslation(defaultDatePickerTranslation, overwriteTranslation)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(value)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialDisplay)

  useEffect(() => {
    setDisplayedMonth(value)
  }, [value])

  return (
    <div className={clsx('col gap-y-4', className)}>
      <div className="row items-center justify-between h-7">
        <TextButton
          className={clsx('row gap-x-1 items-center cursor-pointer select-none', {
            'text-disabled-text': displayMode !== 'day',
          })}
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${new Intl.DateTimeFormat(locale, { month: 'long' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </TextButton>
        {displayMode === 'day' && (
          <div className="row justify-end">
            <SolidButton
              size="small"
              color="primary"
              disabled={!isInTimeSpan(subtractDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowUp size={20}/>
            </SolidButton>
            <SolidButton
              size="small"
              color="primary"
              disabled={!isInTimeSpan(addDuration(displayedMonth, { months: 1 }), start, end)}
              onClick={() => {
                setDisplayedMonth(addDuration(displayedMonth, { months: 1 }))
              }}
            >
              <ArrowDown size={20}/>
            </SolidButton>
          </div>
        )}
      </div>
      {displayMode === 'yearMonth' ? (
        <YearMonthPicker
          {...yearMonthPickerProps}
          displayedYearMonth={value}
          start={start}
          end={end}
          onChange={newDate => {
            setDisplayedMonth(newDate)
            setDisplayMode('day')
          }}
        />
      ) : (
        <div>
          <DayPicker
            {...dayPickerProps}
            displayedMonth={displayedMonth}
            start={start}
            end={end}
            selected={value}
            onChange={date => {
              onChange(date)
            }}
          />
          <div className="mt-2">
            <TextButton
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                onChange(newDate)
              }}
            >
              {translation.today}
            </TextButton>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Example for the Date Picker
 */
export const ControlledDatePicker = ({
                                    value = new Date(),
                                    onChange = noop,
                                    ...props
                                  }: DatePickerProps) => {
  const [date, setDate] = useState<Date>(value)

  useEffect(() => setDate(value), [value])

  return (
    <DatePicker
      {...props}
      value={date}
      onChange={date1 => {
        setDate(date1)
        onChange(date1)
      }}
    />
  )
}
