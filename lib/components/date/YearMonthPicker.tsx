import { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import { equalSizeGroups, range } from '../../util/array'
import clsx from 'clsx'
import { Expandable } from '../Expandable'
import { addDuration, monthsList, subtractDuration } from '../../util/date'
import { useLocale } from '../../hooks/useLanguage'

export type YearMonthPickerProps = {
  displayedYearMonth?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  className?: string,
  maxHeight?: number,
  showValueOpen?: boolean,
}

// TODO use a dynamically loading infinite list here
export const YearMonthPicker = ({
                                  displayedYearMonth = new Date(),
                                  start = subtractDuration(new Date(), { years: 50 }),
                                  end = addDuration(new Date(), { years: 50 }),
                                  onChange = noop,
                                  className = '',
                                  maxHeight = 300,
                                  showValueOpen = true
                                }: YearMonthPickerProps) => {
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToItem = () => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        })
      }
    }

    scrollToItem()
  }, [ref])

  if (end < start) {
    console.error(`startYear: (${start}) less than endYear: (${end})`)
    return null
  }

  const years = range(start.getFullYear(), end.getFullYear())

  return (
    <div className={clsx('col select-none', className)}>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className="col gap-y-1 mr-3">
          {years.map(year => {
            const selectedYear = displayedYearMonth.getFullYear() === year
            return (
              <Expandable
                key={year}
                ref={(displayedYearMonth.getFullYear() ?? new Date().getFullYear()) === year ? ref : undefined}
                label={<span className={clsx({ 'text-primary font-bold': selectedYear })}>{year}</span>}
                initialExpansion={showValueOpen && selectedYear}
              >
                <div className="col gap-y-1 px-2 pb-2">
                  {equalSizeGroups([...monthsList], 3).map((monthList, index) => (
                    <div key={index} className="row">
                      {monthList.map(month => {
                        const monthIndex = monthsList.indexOf(month)
                        const newDate = new Date(year, monthIndex)

                        const selectedMonth = selectedYear && monthIndex === displayedYearMonth.getMonth()
                        const firstOfMonth = new Date(year, monthIndex, 1)
                        const lastOfMonth = new Date(year, monthIndex, 1)
                        const isAfterStart = start === undefined || start <= addDuration(subtractDuration(lastOfMonth, { days: 1 }), { months: 1 })
                        const isBeforeEnd = end === undefined || firstOfMonth <= end
                        const isValid = isAfterStart && isBeforeEnd
                        return (
                          <button
                            key={month}
                            disabled={!isValid}
                            className={clsx(
                              'chip hover:brightness-95 flex-1',
                              {
                                'bg-gray-50 text-black': !selectedMonth && isValid,
                                'bg-primary text-on-primary': selectedMonth && isValid,
                                'bg-disabled-background text-disabled-text': !isValid
                              }
                            )}
                            onClick={() => {
                              onChange(newDate)
                            }}
                          >
                            {new Intl.DateTimeFormat(locale, { month: 'short' }).format(newDate)}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </Expandable>
            )
          })}
        </div>
      </Scrollbars>
    </div>
  )
}

export const ControlledYearMonthPicker = ({
                                         displayedYearMonth = new Date(),
                                         onChange = noop,
                                         ...props
                                       }: YearMonthPickerProps) => {
  const [yearMonth, setYearMonth] = useState<Date>(displayedYearMonth)

  useEffect(() => setYearMonth(displayedYearMonth), [displayedYearMonth])

  return (
    <YearMonthPicker
      displayedYearMonth={yearMonth}
      onChange={date => {
        setYearMonth(date)
        onChange(date)
      }}
      {...props}
    />
  )
}
