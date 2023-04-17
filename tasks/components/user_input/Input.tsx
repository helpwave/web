import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw, tx } from '@helpwave/common/twind'

const noop = () => { /* noop */ }

type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string,
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
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'label' | 'type' | 'onChange' | 'crossOrigin'>

const ControlledInput = ({
  id,
  type = 'text',
  value,
  label,
  onChange = noop,
  className = '',
  ...restProps
}: InputProps) => {
  return (
    <div className={tw('w-full')}>
      {label && <label htmlFor={id} className={tw('block text-sm font-medium text-gray-700')}>{label}</label>}
      <input
        value={value}
        id={id}
        type={type}
        className={tx('mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500', className)}
        onChange={e => onChange(e.target.value)}
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

const UncontrolledInput = ({ defaultValue = '', onChange = noop, ...props }: UncontrolledInputProps) => {
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
