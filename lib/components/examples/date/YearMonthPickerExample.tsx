import { useEffect, useState } from 'react'
import type { YearMonthPickerProps } from '../../date/YearMonthPicker'
import { YearMonthPicker } from '../../date/YearMonthPicker'

export type YearMonthPickerExampleProps = YearMonthPickerProps

/**
 * Example for the YearMonthPicker
 */
export const YearMonthPickerExample = ({
  value = new Date(),
  ...props
}: YearMonthPickerExampleProps) => {
  const [yearMonth, setYearMonth] = useState<Date>(value)

  useEffect(() => setYearMonth(value), [value])

  return (
    <YearMonthPicker
      value={yearMonth}
      {...props}
    />
  )
}
