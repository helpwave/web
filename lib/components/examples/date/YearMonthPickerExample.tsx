import { useEffect, useState } from 'react'
import type { YearMonthPickerProps } from '../../date/YearMonthPicker'
import { YearMonthPicker } from '../../date/YearMonthPicker'
import { noop } from '../../../util/noop'

export type YearMonthPickerExampleProps = YearMonthPickerProps

/**
 * Example for the YearMonthPicker
 */
export const YearMonthPickerExample = ({
  value = new Date(),
  onChange = noop,
  ...props
}: YearMonthPickerExampleProps) => {
  const [yearMonth, setYearMonth] = useState<Date>(value)

  useEffect(() => setYearMonth(value), [value])

  return (
    <YearMonthPicker
      value={yearMonth}
      onChange={date => {
        setYearMonth(date)
        onChange(date)
      }}
      {...props}
    />
  )
}
