import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw, tx } from '../../twind'
import { noop } from './Input'
import { Pencil } from 'lucide-react'
import useSaveDelay from '../../hooks/useSaveDelay'

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
  initialState?: 'editing' | 'display',
  size?: number,
  disclaimer?: string,
  onEditCompleted?: (text: string) => void
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
  size = 20,
  disclaimer,
  onBlur,
  onEditCompleted = noop,
  ...restProps
}: InputProps) => {
  const [isEditing, setIsEditing] = useState(initialState !== 'display')
  const { restartTimer, clearUpdateTimer } = useSaveDelay(() => undefined, 3000)

  const onEditCompletedWrapper = (text: string) => {
    onEditCompleted(text)
    clearUpdateTimer()
  }

  return (
    <div>
      <div
        className={tw('flex flex-row items-center w-full gap-x-2 overflow-hidden')}
        onClick={() => !isEditing ? setIsEditing(!isEditing) : undefined}
      >
        <div className={tx('flex flex-row overflow-hidden', { 'flex-1': isEditing })}>
          {isEditing ? (
            <input
              autoFocus
              {...restProps}
              value={value}
              type={type}
              id={id}
              onChange={event => {
                const value = event.target.value
                restartTimer(() => {
                  onEditCompletedWrapper(value)
                })
                onChange(value)
              }}
              onBlur={(event) => {
                if (onBlur) {
                  onBlur(event)
                }
                onEditCompletedWrapper(value)
                setIsEditing(false)
              }}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  setIsEditing(false)
                  onEditCompletedWrapper(value)
                }
              }}
              className={tx(labelClassName, `w-full border-none rounded-none focus:ring-0 shadow-transparent decoration-hw-primary-400 p-0 underline-offset-4`, {
                underline: isEditing
              })}
              onFocus={event => event.target.select()}
            />
          ) : (
            <span
              className={tx(labelClassName, 'max-w-xs break-words overflow-hidden')}
            >
        {value}
        </span>
          )}
        </div>
        <Pencil className={tx(`min-w-[${size}px] cursor-pointer`, { 'text-transparent': isEditing })} size={size} />
      </div>
      {(isEditing && disclaimer) && (
        <label className={tw('text-hw-negative-500')}>
          {disclaimer}
        </label>
      )}
    </div>
  )
}
