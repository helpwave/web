import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes, forwardRef
} from 'react'
import clsx from 'clsx'
import useSaveDelay from '../../hooks/useSaveDelay'
import { noop } from '../../util/noop'
import type { LabelProps } from './Label'
import { Label } from './Label'

export type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  id?: string,
  value: string,
  label?: Omit<LabelProps, 'id'>,
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
  onChange?: (text: string, event: ChangeEvent<HTMLInputElement>) => void,
  onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  onEditCompleted?: (text: string, event: ChangeEvent<HTMLInputElement>) => void,
  expanded?: boolean,
  containerClassName?: string,
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'label' | 'type' | 'onChange' | 'crossOrigin'>

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
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
                           expanded = true,
                           onBlur,
                           containerClassName,
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
    <div className={clsx({ 'w-full': expanded }, containerClassName)}>
      {label && <Label {...label} htmlFor={id} className={clsx('mb-1', label.className)}/>}
      <input
        ref={ref}
        value={value}
        id={id}
        type={type}
        className={clsx('block bg-surface text-on-surface px-3 py-2 rounded-md w-full border-2 border-gray-200 hover:border-primary focus:outline-none focus:border-primary focus:ring-primary', className)}
        onBlur={event => {
          if (onBlur) {
            onBlur(event)
          }
          if (onEditCompleted) {
            onEditCompleted(event.target.value, event)
            clearUpdateTimer()
          }
        }}
        onChange={e => {
          const value = e.target.value
          if (onEditCompleted) {
            restartTimer(() => {
              onEditCompleted(value, e)
              clearUpdateTimer()
            })
          }
          onChange(value, e)
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
  defaultValue?: string,
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

  const handleChange = (text: string, event: ChangeEvent<HTMLInputElement>) => {
    setValue(text)
    onChange(text, event)
  }

  return (
    <ControlledInput
      {...props}
      value={value}
      onChange={handleChange}
    />
  )
}

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string,
  labelText?: string,
  errorText?: string,
  labelClassName?: string,
  errorClassName?: string,
  containerClassName?: string,
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput({
                                                                                    id,
                                                                                    labelText,
                                                                                    errorText,
                                                                                    className,
                                                                                    labelClassName,
                                                                                    errorClassName,
                                                                                    containerClassName,
                                                                                    required,
                                                                                    ...restProps
                                                                                  }, ref) {
  const input = (
    <input
      ref={ref}
      id={id}
      {...restProps}
      className={clsx(
        'block bg-surface text-on-surface px-3 py-2 rounded-md w-full border-2 border-gray-200 hover:border-primary focus:outline-none focus:border-primary focus:ring-primary',
        {
          'focus:border-primary focus:ring-primary': !errorText,
          'focus:border-negative focus:ring-negative text-negative': !!errorText,
        },
        className
        )}
    />
  )

  return (
    <div className={clsx('flex flex-col gap-y-1', containerClassName)}>
      {labelText && (
        <label htmlFor={id} className={clsx('textstyle-label-md', labelClassName)}>
          {labelText}
          {required && <span className="text-primary font-bold">*</span>}
        </label>
      )}
      {input}
      {errorText && <label htmlFor={id} className={clsx('text-negative', errorClassName)}>{errorText}</label>}
    </div>
  )
})

export {
  UncontrolledInput,
  ControlledInput as Input,
  FormInput
}
