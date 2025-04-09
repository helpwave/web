import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { noop } from '../../util/noop'
import { addDuration, subtractDuration } from '../../util/date'
import clsx from 'clsx'
import { TextButton } from '../Button'
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
  dayPickerProps?: Omit<DayPickerProps, 'value' | 'onChange' | 'selected'>,
  yearMonthPickerProps?: Omit<YearMonthPickerProps, 'value' | 'onChange' | 'startYear' | 'endYear'>,
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
    <div className={clsx('flex flex-col gap-y-2', className)}>
      <div className={clsx('flex flex-row justify-between')}>
        <div
          className={clsx('flex flex-row gap-x-1 items-center cursor-pointer select-none flex-[6]', {
            'text-gray-500': displayMode !== 'day',
          })}
          onClick={() => setDisplayMode(displayMode === 'day' ? 'yearMonth' : 'day')}
        >
          {`${new Intl.DateTimeFormat(locale, { month: 'long' }).format(displayedMonth)} ${displayedMonth.getFullYear()}`}
          <ChevronDown size={16}/>
        </div>
        {displayMode === 'day' && (
          <div className={clsx('flex flex-row gap-x-2 flex-1 items-center justify-center')}>
            <ArrowUp
              className={clsx('cursor-pointer bg-gray-200 hover:bg-gray-300 w-5 h-5 rounded-full')}
              size={20}
              onClick={() => {
                setDisplayedMonth(subtractDuration(displayedMonth, { months: 1 }))
              }}
            />
            <ArrowDown
              className={clsx('cursor-pointer bg-gray-200 hover:bg-gray-300 w-5 h-5 rounded-full')}
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
          <div className={clsx('mt-1')}>
            <TextButton
              onClick={() => {
                const newDate = new Date()
                newDate.setHours(value.getHours(), value.getMinutes())
                onChange(newDate)
              }}
              className={clsx('!p-0')}
            >
              {translation.today}
            </TextButton>
          </div>
        </div>
      )}
    </div>
  )
}
