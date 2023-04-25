import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw, tx } from '../../twind'
import { noop } from './Input'
import { Pencil } from 'lucide-react'

type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string,
  value: string,
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
  labelClassName?: string,
  initialState?: 'editing' | 'display'
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'label' | 'type' | 'onChange' | 'crossOrigin'>

/**
 * A Text input component for inputting text. It changes appearance upon entering the edit mode and switches
 * back to display mode on loss of focus or on enter
 *
 * The State is managed by the parent
 */
export const ToggleableInput = ({
  id,
  type = 'text',
  value,
  onChange = noop,
  labelClassName = '',
  initialState = 'display',
  ...restProps
}: InputProps) => {
  const [isEditing, setIsEditing] = useState(initialState !== 'display')
  return (
    <div
      className={tw('flex flex-row items-center w-full')}
      onClick={() => !isEditing ? setIsEditing(!isEditing) : undefined}
    >
      {isEditing ? (
        <input
          autoFocus
          {...restProps}
          value={value}
          type={type}
          id={id}
          onChange={event => onChange(event.target.value)}
          onBlur={() => {
            setIsEditing(false)
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              setIsEditing(false)
            }
          }}
          readOnly={!isEditing}
          className={tx(labelClassName, 'max-w-[calc(100%_-_28px)] border-none rounded-none focus:ring-0 shadow-transparent decoration-hw-primary-400 p-0 underline-offset-4', {
            underline: isEditing
          })}
        />
      ) : (
        <span
          className={tx(labelClassName, 'max-w-[calc(100%_-_28px)] break-words overflow-hidden text-ellipsis')}
        >
        {value}
        </span>
      )}

      {!isEditing && <Pencil className={tw('ml-[8px] cursor-pointer')} size={20}/>}
    </div>
  )
}
