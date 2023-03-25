import { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { tw, tx } from '@helpwave/common/twind/index'

import CheckIcon from '../icons/Check'

type CheckboxProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string
  label: string
  /**
   * @default false
   */
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

const ControlledCheckbox = ({ id, label, checked, disabled, onChange }: CheckboxProps) => {
  return (
    <div className={tw('flex justify-center items-center space-x-2')}>
      <CheckboxPrimitive.Root
        onCheckedChange={onChange}
        checked={checked}
        disabled={disabled}
        id={id}
        className={tx(
          'w-4 h-4 flex items-center mx-[1px] border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:border-2 focus:w-[18px] focus:h-[18px] focus:mx-0',
          {
            'text-gray-400': disabled,
            'bg-indigo-600 text-white': checked,
            'bg-white text-indigo-600': !checked
          }
        )}
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon width={14} height={14} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label className={tw('text-sm font-medium')} htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

type UncontrolledCheckboxProps = Omit<CheckboxProps, 'value'> & {
  /**
   * @default false
   */
  defaultValue?: boolean
}

const UncontrolledCheckbox = ({ onChange, defaultValue = false, ...props }: UncontrolledCheckboxProps) => {
  const [checked, setChecked] = useState(defaultValue)

  const handleChange = (checked: boolean) => {
    onChange(checked)
    setChecked(checked)
  }

  return <ControlledCheckbox {...props} checked={checked} onChange={handleChange} />
}

export { UncontrolledCheckbox, ControlledCheckbox as Checkbox }
