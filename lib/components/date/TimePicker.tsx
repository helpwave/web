import { useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import { range } from '../../util/array'
import { tw, tx } from '../../twind'

type MinuteIncrement = '1min' | '5min' | '10min' | '15min' | '30min'

export type TimePickerProps = {
  time?: Date,
  onChange?: (time: Date) => void,
  is24HourFormat?: boolean,
  minuteIncrement?: MinuteIncrement,
  maxHeight?: number,
  className?: string
}

export const TimePicker = ({
  time = new Date(),
  onChange = noop,
  is24HourFormat = true,
  minuteIncrement = '5min',
  maxHeight = 300,
  className = ''
}: TimePickerProps) => {
  const minuteRef = useRef(null)
  const hourRef = useRef(null)

  const isPM = time?.getHours() >= 11
  const hours = is24HourFormat ? range(0, 23) : range(1, 12)
  let minutes = range(0, 59)
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

  const style = (selected: boolean) => tx('px-2 py-1 cursor-pointer hover:bg-hw-primary-200 border border-2 rounded-md hover:border-hw-primary-400 text-center mr-3',
    { 'bg-hw-primary-100 border-hw-primary-300': selected, 'border-transparent': !selected })

  const onChangeWrapper = (transformer: (newDate: Date) => void) => {
    const newDate = new Date(time)
    transformer(newDate)
    onChange(newDate)
  }

  return (
    <div className={tx('flex flex-row gap-x-2 w-fit', className)}>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className={tw('flex flex-col gap-y-1')}>
          {hours.map(hour => {
            const currentHour = hour === time?.getHours()
            return (
              <div
                key={hour}
                ref={currentHour ? hourRef : undefined}
                className={style(currentHour)}
                onClick={() => onChangeWrapper(newDate => newDate.setHours(hour + (!is24HourFormat && isPM ? 12 : 0)))}
              >
                {hour.toString().padStart(2, '0')}
              </div>
            )
          })}
          <div className={tw('flex grow')}></div>
        </div>
      </Scrollbars>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className={tw('flex flex-col gap-y-1')}>
          {minutes.map(minute => {
            const currentMinute = minute === time?.getMinutes()
            return (
              <div
                key={minute}
                ref={currentMinute ? minuteRef : undefined}
                className={style(currentMinute)}
                onClick={() => onChangeWrapper(newDate => newDate.setMinutes(minute))}
              >
                {minute.toString().padStart(2, '0')}
              </div>
            )
          })}
          <div className={tw('flex flex-col grow')}></div>
        </div>
      </Scrollbars>
      {!is24HourFormat && (
        <div className={tw('flex flex-col gap-y-1')}>
          <div
            className={style(!isPM)}
            onClick={() => onChangeWrapper(newDate => isPM && newDate.setMinutes(newDate.getHours() - 12))}
          >
            AM
          </div>
          <div
            className={style(isPM)}
            onClick={() => onChangeWrapper(newDate => !isPM && newDate.setMinutes(newDate.getHours() + 12))}
          >
            PM
          </div>
        </div>
      )}
    </div>
  )
}
