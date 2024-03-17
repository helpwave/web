import { useEffect, useState } from 'react'
import { noop } from '../../../util/noop'
import type { TimePickerProps } from '../../date/TimePicker'
import { TimePicker } from '../../date/TimePicker'

export type TimePickerExampleProps = TimePickerProps

/**
 * Example for the TimePicker
 */
export const TimePickerExample = ({
  time,
  onChange = noop,
  ...props
}: TimePickerExampleProps) => {
  const [value, setValue] = useState(time)
  useEffect(() => setValue(time), [time])

  return (
    <TimePicker
      {...props}
      time={value}
      onChange={time1 => {
        setValue(time1)
        onChange(time1)
      }}
    />
  )
}
