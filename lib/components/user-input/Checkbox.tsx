import { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { tw, tx } from '../../twind'
import type { LabelProps } from './Label'
import { Label } from './Label'

type CheckboxProps = {
  /** used for the label's `for` attribute */
  id?: string,
  label?: Omit<LabelProps, 'id'>,
  /**
   * @default false
   */
  checked: CheckedState,
  disabled?: boolean,
  onChange?: (checked: boolean) => void,
  onChangeTristate?: (checked: CheckedState) => void,
  className?: string
}

/**
 * A Tristate checkbox
 *
 * The state is managed by the parent
 */
const ControlledCheckbox = ({ id, label, checked, disabled, onChange, onChangeTristate, className }: CheckboxProps) => {
  return (
    <div className={tw('flex justify-center items-center space-x-2')}>
      <CheckboxPrimitive.Root
        onCheckedChange={checked => {
          if (onChangeTristate) {
            onChangeTristate(checked)
          }
          if (onChange) {
            onChange(checked === 'indeterminate' ? false : checked)
          }
        }}
        checked={checked}
        disabled={disabled}
        id={id}
        className={tx('w-[18px] h-[18px] flex items-center border border-2 border-gray-300 rounded outline-none focus:border-hw-primary-500', {
          'text-gray-400': disabled,
          'bg-hw-primary-300 border-hw-primary-500 hover:border-hw-primary-700 text-hw-primary-500': checked === true || checked === 'indeterminate',
          'bg-white hover:border-gray-400 focus:hover:border-hw-primary-700': !checked
        }, className)}
      >
        <CheckboxPrimitive.Indicator>
          {checked === true && <Check width={14} height={14}/>}
          {checked === 'indeterminate' && <Minus width={14} height={14}/>}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <Label {...label} htmlFor={id} />}
    </div>
  )
}

type UncontrolledCheckboxProps = Omit<CheckboxProps, 'value' | 'checked'> & {
  /**
   * @default false
   */
  defaultValue?: CheckedState
}

/**
 * A Tristate checkbox
 *
 * The state is managed by this component
 */
const UncontrolledCheckbox = ({
  onChange,
  onChangeTristate,
  defaultValue = false,
  ...props
}: UncontrolledCheckboxProps) => {
  const [checked, setChecked] = useState(defaultValue)

  const handleChange = (checked: CheckedState) => {
    if (onChangeTristate) {
      onChangeTristate(checked)
    }
    if (onChange) {
      onChange(checked === 'indeterminate' ? false : checked)
    }
    setChecked(checked)
  }

  return (
    <ControlledCheckbox
      {...props}
      checked={checked}
      onChangeTristate={handleChange}
    />
  )
}

export {
  UncontrolledCheckbox,
  ControlledCheckbox as Checkbox
}
