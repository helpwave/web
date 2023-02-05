import { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { tw, tx } from '@helpwave/common/twind/index'

import CheckIcon from '../icons/Check'

// TODO: these styles pretty much only work for checked={true} and disabled={true}

type CheckboxProps = {
  /**
   * used for the label's `for` attribute
   */
  id: string,
  label: string,
  /**
   * @default false
   */
  checked: boolean,
  disabled?: boolean,
  onChange: (checked: boolean) => void
}

const ControlledCheckbox = ({ id, label, checked, disabled, onChange }: CheckboxProps) => {
  return (
    <div className={tw('flex justify-start items-center space-x-2')}>
      <CheckboxPrimitive.Root
        onCheckedChange={onChange}
        checked={checked}
        disabled={disabled}
        id={id}
        className={tx('w-6 h-6 flex items-center mx-[1px] p-[2.5px] border-2 border-hw-primary-600 rounded-full focus:outline-none focus:border-indigo-500 focus:border-2 focus:w-[24px] focus:h-[24px]', {
          'text-gray-400': disabled,
          'bg-hw-primary-400 text-hw-primary-600': checked,
          'bg-white text-indigo-600': !checked
        })}
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon width={14} height={14} strokeWidth={4} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label className={tw('text-2xl')} htmlFor={id}>{label}</label>
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

  return (
    <ControlledCheckbox
      {...props}
      checked={checked}
      onChange={handleChange}
    />
  )
}

export {
  UncontrolledCheckbox,
  ControlledCheckbox as Checkbox
}
