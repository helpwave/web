import { useEffect, useState } from 'react'
import type { DateTimePickerProps } from '../../user-input/DateAndTimePicker'
import { DateTimePicker } from '../../user-input/DateAndTimePicker'
import { noop } from '../../../util/noop'
import type { DatePickerProps } from '../../date/DatePicker'
import type { TimePickerProps } from '../../date/TimePicker'
import type { YearMonthPickerProps } from '../../date/YearMonthPicker'
import type { DayPickerProps } from '../../date/DayPicker'

export type DateTimePickerExampleProps = Omit<DateTimePickerProps, 'datePickerProps' | 'timePickerProps'> &
  Pick<DatePickerProps, 'initialDisplay'> & Pick<TimePickerProps, 'is24HourFormat' | 'minuteIncrement'> &
  Pick<YearMonthPickerProps, 'showValueOpen'> & Pick<DayPickerProps, 'markToday' | 'weekStart'>

/**
 * Example for the DateTimePicker
 */
export const DateTimePickerExample = ({
  value,
  onChange = noop,
  onRemove = noop,
  onFinish = noop,
  initialDisplay,
  is24HourFormat,
  minuteIncrement,
  showValueOpen,
  markToday,
  weekStart,
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
      timePickerProps={{ is24HourFormat, minuteIncrement }}
      datePickerProps={{ initialDisplay, dayPickerProps: { markToday, weekStart }, yearMonthPickerProps: { showValueOpen } }}
    />
  )
}
