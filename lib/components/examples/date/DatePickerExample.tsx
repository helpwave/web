import { useEffect, useState } from 'react'
import type { DatePickerProps } from '../../date/DatePicker'
import { DatePicker } from '../../date/DatePicker'
import { noop } from '../../../util/noop'

export type DatePickerExampleProps = DatePickerProps

/**
 * Example for the Date Picker
 */
export const DatePickerExample = ({
  value = new Date(),
  onChange = noop,
  ...props
}: DatePickerExampleProps) => {
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
