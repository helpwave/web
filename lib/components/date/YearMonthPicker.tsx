import { useEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { equalSizeGroups, range } from '../../util/array'
import { tw, tx } from '../../twind'
import { Expandable } from '../Expandable'
import { Span } from '../Span'
import type { Languages } from '../../hooks/useLanguage'
import { addDuration, monthsList, subtractDuration } from '../../util/date'

type YearMonthPickerTranslation = {
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

const defaultYearMonthPickerTranslation: Record<Languages, YearMonthPickerTranslation> = {
  en: {
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

export type YearMonthPickerProps = {
  value?: Date,
  startYear?: Date,
  endYear?: Date,
  onChange?: (date: Date) => void,
  className?: string,
  maxHeight?: number,
  showValueOpen?: boolean
}
export const YearMonthPicker = ({
  language,
  value = new Date(),
  startYear = subtractDuration(new Date(), { years: 50 }),
  endYear = addDuration(new Date(), { years: 50 }),
  onChange = noop,
  className = '',
  maxHeight = 300,
  showValueOpen = true
}: PropsWithLanguage<YearMonthPickerTranslation, YearMonthPickerProps>) => {
  const translation = useTranslation(language, defaultYearMonthPickerTranslation)
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

  if (endYear < startYear) {
    console.error(`startYear: (${startYear}) less than endYear: (${endYear})`)
    return null
  }

  const years = range(startYear.getFullYear(), endYear.getFullYear())

  return (
    <div className={tx('flex flex-col select-none', className)}>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className={tw('flex flex-col gap-y-1 mr-3')}>
          {years.map(year => {
            const selectedYear = value.getFullYear() === year
            return (
              <Expandable
                key={year}
                ref={(value.getFullYear() ?? new Date().getFullYear()) === year ? ref : undefined}
                label={<Span className={tx({ '!text-hw-primary-400 font-bold': selectedYear })}>{year}</Span>}
                className={tw('gap-y-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm')}
                headerClassName={tw('px-2 py-1 rounded-lg bg-gray-100 hover:bg-hw-primary-200')}
                initialExpansion={showValueOpen && selectedYear}
              >
                <div className={tw('flex flex-col gap-y-1 px-2 pb-2')}>
                  {equalSizeGroups([...monthsList], 3).map((monthList, index) => (
                    <div key={index} className={tw('flex flex-row gap-x-2')}>
                      {monthList.map(month => {
                        const monthIndex = monthsList.indexOf(month)
                        const selectedMonth = selectedYear && monthIndex === value.getMonth()
                        return (
                          <div
                            key={month}
                            className={tx('px-2 py-1 rounded-md border border-2 hover:bg-hw-primary-200 hover:border-hw-primary-400 flex-1 text-center cursor-pointer',
                              {
                                'bg-white border-transparent': !selectedMonth,
                                'border-hw-primary-300 bg-hw-primary-100 hover:bg-hw-primary-200': selectedMonth
                              }
                            )}
                            onClick={() => {
                              const newDate = new Date(value)
                              newDate.setFullYear(year, monthIndex)
                              onChange(newDate)
                            }}
                          >
                            {translation[month].substring(0, 3)}
                          </div>
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
