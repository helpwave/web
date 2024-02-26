import { useEffect, useState } from 'react'
import type { DayPickerProps } from '../../date/DayPicker'
import { DayPicker } from '../../date/DayPicker'
import { noop } from '../../../util/noop'

export type DayPickerExampleProps = DayPickerProps

/**
 * Example for the DayPicker
 */
export const DayPickerExample = ({
  value,
  onChange = noop,
}: DayPickerExampleProps) => {
  const [date, setDate] = useState(value)

  useEffect(() => setDate(value), [value])

  return (
    <DayPicker
      value={date}
      onChange={date1 => {
        setDate(date1)
        onChange(date1)
      }}
    />
  )
}
