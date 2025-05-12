import { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import { closestMatch, range } from '../../util/array'
import clsx from 'clsx'

type MinuteIncrement = '1min' | '5min' | '10min' | '15min' | '30min'

export type TimePickerProps = {
  time?: Date,
  onChange?: (time: Date) => void,
  is24HourFormat?: boolean,
  minuteIncrement?: MinuteIncrement,
  maxHeight?: number,
  className?: string,
}

export const TimePicker = ({
  time = new Date(),
  onChange = noop,
  is24HourFormat = true,
  minuteIncrement = '5min',
  maxHeight = 300,
  className = ''
}: TimePickerProps) => {
  const minuteRef = useRef<HTMLButtonElement>(null)
  const hourRef = useRef<HTMLButtonElement>(null)

  const isPM = time.getHours() >= 11
  const hours = is24HourFormat ? range(0, 23) : range(1, 12)
  let minutes = range(0, 59)

  useEffect(() => {
    const scrollToItem = () => {
      if (minuteRef.current) {
        const container = minuteRef.current.parentElement!

        const hasOverflow = container.scrollHeight > maxHeight
        if (hasOverflow) {
          minuteRef.current.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
          })
        }
      }
    }
    scrollToItem()
  }, [minuteRef, minuteRef.current]) // eslint-disable-line

  useEffect(() => {
    const scrollToItem = () => {
      if (hourRef.current) {
        const container = hourRef.current.parentElement!

        const hasOverflow = container.scrollHeight > maxHeight
        if (hasOverflow) {
          hourRef.current.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
          })
        }
      }
    }
    scrollToItem()
  }, [hourRef, hourRef.current]) // eslint-disable-line

  switch (minuteIncrement) {
    case '5min':
      minutes = minutes.filter(value => value % 5 === 0)
      break
    case '10min':
      minutes = minutes.filter(value => value % 10 === 0)
      break
    case '15min':
      minutes = minutes.filter(value => value % 15 === 0)
      break
    case '30min':
      minutes = minutes.filter(value => value % 30 === 0)
      break
  }

  const closestMinute = closestMatch(minutes, (item1, item2) => Math.abs(item1 - time.getMinutes()) < Math.abs(item2 - time.getMinutes()))

  const style = (selected: boolean) => clsx('chip-full hover:brightness-90 hover:bg-primary hover:text-on-primary rounded-md mr-3',
    { 'bg-primary text-on-primary': selected, 'bg-white text-black': !selected })

  const onChangeWrapper = (transformer: (newDate: Date) => void) => {
    const newDate = new Date(time)
    transformer(newDate)
    onChange(newDate)
  }

  return (
    <div className={clsx('row gap-x-2 w-fit min-w-[150px] select-none', className)}>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className="col gap-y-1 h-full">
          {hours.map(hour => {
            const currentHour = hour === time.getHours() - (!is24HourFormat && isPM ? 12 : 0)
            return (
              <button
                key={hour}
                ref={currentHour ? hourRef : undefined}
                className={style(currentHour)}
                onClick={() => onChangeWrapper(newDate => newDate.setHours(hour + (!is24HourFormat && isPM ? 12 : 0)))}
              >
                {hour.toString().padStart(2, '0')}
              </button>
            )
          })}
        </div>
      </Scrollbars>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className="col gap-y-1 h-full">
          {minutes.map(minute => {
            const currentMinute = minute === closestMinute
            return (
              <button
                key={minute + minuteIncrement} // minute increment so that scroll works
                ref={currentMinute ? minuteRef : undefined}
                className={style(currentMinute)}
                onClick={() => onChangeWrapper(newDate => newDate.setMinutes(minute))}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            )
          })}
        </div>
      </Scrollbars>
      {!is24HourFormat && (
        <div className="col gap-y-1">
          <button
            className={style(!isPM)}
            onClick={() => onChangeWrapper(newDate => isPM && newDate.setHours(newDate.getHours() - 12))}
          >
            AM
          </button>
          <button
            className={style(isPM)}
            onClick={() => onChangeWrapper(newDate => !isPM && newDate.setHours(newDate.getHours() + 12))}
          >
            PM
          </button>
        </div>
      )}
    </div>
  )
}

export const ControlledTimePicker = ({
                                    time,
                                    onChange = noop,
                                    ...props
                                  }: TimePickerProps) => {
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
