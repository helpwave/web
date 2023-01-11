import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { tw } from '@twind/core'

// TODO: this is copied over from `app/components/Input.tsx` and only slightly modified

const noop = () => { /* noop */ }

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
  /**
   * If this element is part of an input group, then should indicate which of the borders to collapse
   * For inputs that are part of a group the label is not rendered, rely on using placeholder text instead
   * @default []
   */
  group?: ('top' | 'left' | 'bottom' | 'right')[],
  /**
   * Callback for when the input's value changes
   * This is pretty much required but made optional for the rare cases where it actually isn't need such as when used with disabled
   * That could be enforced through a union type but that seems a bit overkill
   * @default noop
   */
  onChange?: (text: string) => void
} & Omit<InputHTMLAttributes<Element>, 'value' | 'type' | 'onChange'>

const ControlledInput = ({ id, type = 'text', value, label, group = [], onChange = noop, ...restProps }: InputProps) => {
  const borders = { /* eslint-disable key-spacing, no-multi-spaces */
    top:    group.includes('top')    ? 'border-t-1 border-t-hw-temp-gray-b' : 'border-t-2 border-t-hw-primary-700 mt-1',
    left:   group.includes('left')   ? 'border-l-1 border-l-hw-temp-gray-b' : 'border-l-2 border-l-hw-primary-700',
    bottom: group.includes('bottom') ? 'border-b-1 border-b-hw-temp-gray-b' : 'border-b-2 border-b-hw-primary-700',
    right:  group.includes('right')  ? 'border-r-1 border-r-hw-temp-gray-b' : 'border-r-2 border-r-hw-primary-700',
  } /* eslint-enable key-spacing, no-multi-spaces */

  const corners = { /* eslint-disable key-spacing, no-multi-spaces */
    tl: group.includes('top')    || group.includes('left')  ? '' : 'rounded-tl-md',
    bl: group.includes('bottom') || group.includes('left')  ? '' : 'rounded-bl-md',
    br: group.includes('bottom') || group.includes('right') ? '' : 'rounded-br-md',
    tr: group.includes('top')    || group.includes('right') ? '' : 'rounded-tr-md',
  } /* eslint-enable key-spacing, no-multi-spaces */

  return (
    <div className={tw('w-full h-full')}>
      {group.length === 0 ? <label htmlFor={id} className={tw('block font-medium text-white')}>{label}</label> : null}
      <input
        value={value}
        id={id}
        type={type}
        className={tw(`block w-full h-full bg-hw-temp-gray-a placeholder:text-[#8E8E93] ${Object.values(borders).join(' ')} ${Object.values(corners).join(' ')} shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500`)}
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
