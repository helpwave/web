import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw, tx } from '@helpwave/common/twind'
import { Input, noop } from './Input'
import Edit from '@helpwave/common/icons/Edit'

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
  labelClassName?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'label' | 'type' | 'onChange' | 'crossOrigin'>

export const ToggleableInput = ({
  id,
  type = 'text',
  value,
  label,
  onChange = noop,
  labelClassName = '',
  ...restProps
}: InputProps) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div
      className={tw('flex flex-row justify-between items-center')}
      onClick={() => !isEditing ? setIsEditing(!isEditing) : undefined}
    >
      <Input
        autoFocus
        {...restProps}
        value={value}
        type={type}
        id={id}
        label={label}
        onChange={onChange}
        onBlur={() => {
          setIsEditing(false)
        }}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            setIsEditing(false)
          }
        }}
        readOnly={!isEditing}
        className={tx('text-xl font-semibold border-none rounded-none focus:ring-0 shadow-transparent decoration-hw-primary-400 p-0', { underline: isEditing })}
      />
      {!isEditing && <Edit className={tw('ml-2 scale-[80%] cursor-pointer')}/>}
    </div>
  )
}
