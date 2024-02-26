import { useEffect, useState } from 'react'
import type { DateTimePickerProps } from '../../user-input/DateAndTimePicker'
import { DateTimePicker } from '../../user-input/DateAndTimePicker'
import { noop } from '../../../util/noop'

export type DateTimePickerExampleProps = DateTimePickerProps

/**
 * Example for the DateTimePicker
 */
export const DateTimePickerExample = ({
  value,
  onChange = noop,
  onRemove = noop,
  onFinish = noop,
  ...props
}: DateTimePickerExampleProps) => {
  const [time, setTime] = useState(value)

  useEffect(() => setTime(value), [value])
  return (
    <DateTimePicker
      {...props}
      value={time}
      onChange={date => {
        onChange(date)
        setTime(date)
      }}
      onRemove={() => {
        onRemove()
        setTime(new Date())
      }}
      onFinish={date => {
        onFinish(date)
        setTime(date)
      }}
    />
  )
}
