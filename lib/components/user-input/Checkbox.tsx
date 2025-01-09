import { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { tw, tx } from '../../twind'
import type { AppColor } from '../../twind/config'
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
  size?: number,
  className?: string,
  color?: AppColor
}

/**
 * A Tristate checkbox
 *
 * The state is managed by the parent
 */
const ControlledCheckbox = ({
  id,
  label,
  checked,
  disabled,
  onChange,
  onChangeTristate,
  size = 18,
  className = '',
  color = 'hw-primary',
}: CheckboxProps) => {
  // Make sure there is an appropriate minimum
  const usedSize = Math.max(size, 14)
  const innerIconSize = usedSize - 4
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
        className={tx(`w-[${usedSize}px] h-[${usedSize}px] flex items-center border border-2 border-gray-300 rounded outline-none focus:border-${color}-500`, {
          'text-gray-400': disabled,
          [`bg-${color}-300 border-${color}-500 hover:border-${color}-700 text-${color}-500`]: checked === true || checked === 'indeterminate',
          [`bg-white hover:border-gray-400 focus:hover:border-${color}-700`]: !checked
        }, className)}
      >
        <CheckboxPrimitive.Indicator>
          {checked === true && <Check width={innerIconSize} height={innerIconSize}/>}
          {checked === 'indeterminate' && <Minus width={innerIconSize} height={innerIconSize}/>}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <Label {...label} htmlFor={id}/>}
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
