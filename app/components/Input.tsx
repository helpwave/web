import { useState } from 'react'
import type { HTMLInputTypeAttribute } from 'react'

type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string,
  /**
   * @default 'text'
   */
  type?: HTMLInputTypeAttribute,
  value: string,
  placeholder?: string,
  autocomplete?: string,
  label: string,
  onChange: (text: string) => void
}

const ControlledInput = ({ id, type = 'text', value, placeholder, autocomplete, label, onChange }: InputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        className="mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
        onChange={e => onChange(e.target.value)}
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
