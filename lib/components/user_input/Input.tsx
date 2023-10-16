import React, { useEffect, useRef, useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw, tx } from '../../twind'
import { Span } from '../Span'
import useSaveDelay from '../../hooks/useSaveDelay'
import { noop } from '../../util/noop'

export type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id?: string,
  value: string,
  label?: string,
  /**
   * @default 'text'
   */
  type?: HTMLInputTypeAttribute,
  /**
   * Callback for when the input's value changes
   * This is pretty much required but made optional for the rare cases where it actually isn't need such as when used with disabled
   * That could be enforced through a union type but that seems a bit overkill
   * @default noop
   */
  onChange?: (text: string) => void,
  onChangeEvent?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  onEditCompleted?: (text: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'label' | 'type' | 'onChange' | 'crossOrigin'>

/**
 * A Component for inputting text or other information
 *
 * It's state is managed must be managed by the parent
 */
const ControlledInput = ({
  id,
  type = 'text',
  value,
  label,
  onChange = noop,
  onChangeEvent = noop,
  className = '',
  onEditCompleted,
  onBlur,
  ...restProps
}: InputProps) => {
  const {
    restartTimer,
    clearUpdateTimer
  } = useSaveDelay(() => undefined, 3000)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (restProps.autoFocus) {
      ref.current?.focus()
    }
  }, [restProps.autoFocus])
  return (
    <div className={tw('w-full')}>
      {label && <label htmlFor={id} className={tw('mb-1')}><Span type="labelSmall">{label}</Span></label>}
      <input
        ref={ref}
        value={value}
        id={id}
        type={type}
        className={tx('block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500', className)}
        onBlur={event => {
          if (onBlur) {
            onBlur(event)
          }
          if (onEditCompleted) {
            onEditCompleted(event.target.value)
            clearUpdateTimer()
          }
        }}
        onChange={e => {
          const value = e.target.value
          if (onEditCompleted) {
            restartTimer(() => {
              onEditCompleted(value)
              clearUpdateTimer()
            })
          }
          onChange(value)
          onChangeEvent(e)
        }}
        {...restProps}
      />
    </div>
  )
}

type UncontrolledInputProps = Omit<InputProps, 'value'> & {
  /**
   * @default ''
   */
  defaultValue?: string
}

/**
 * A Component for inputting text or other information
 *
 * Its state is managed by the component itself
 */
const UncontrolledInput = ({
  defaultValue = '',
  onChange = noop,
  ...props
}: UncontrolledInputProps) => {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (text: string) => {
    setValue(text)
    onChange(text)
  }

  return (
    <ControlledInput
      {...props}
      value={value}
      onChange={handleChange}
    />
  )
}

export {
  UncontrolledInput,
  ControlledInput as Input,
  noop
}
