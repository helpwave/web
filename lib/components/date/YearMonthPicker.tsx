import { useEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import { equalSizeGroups, range } from '../../util/array'
import { tw, tx } from '../../twind'
import { Expandable } from '../Expandable'
import { Span } from '../Span'
import { addDuration, monthsList, subtractDuration } from '../../util/date'
import { useLocals } from '../../hooks/useLanguage'

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
  value = new Date(),
  startYear = subtractDuration(new Date(), { years: 50 }),
  endYear = addDuration(new Date(), { years: 50 }),
  onChange = noop,
  className = '',
  maxHeight = 300,
  showValueOpen = true
}: YearMonthPickerProps) => {
  const local = useLocals()
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
                        const newDate = new Date(value)
                        const monthIndex = monthsList.indexOf(month)
                        newDate.setFullYear(year, monthIndex)
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
                            onClick={() => { onChange(newDate) }}
                          >
                            {new Intl.DateTimeFormat(local, { month: 'short' }).format(newDate)}
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
