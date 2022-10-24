import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string,
  value: string,
  label: string,
  /**
   * @default 'text'
   */
  type?: HTMLInputTypeAttribute,
  onChange: (text: string) => void
} & Omit<InputHTMLAttributes<Element>, 'id' | 'value' | 'label' | 'type' | 'onChange'>

const ControlledInput = ({ id, type = 'text', value, label, onChange, ...restProps }: InputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        id={id}
        type={type}
        className="mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
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

const UncontrolledInput = ({ defaultValue = '', onChange, ...props }: UncontrolledInputProps) => {
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
  ControlledInput as Input
}
