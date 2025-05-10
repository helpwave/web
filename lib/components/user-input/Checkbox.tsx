import { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'

type CheckBoxSize = 'small' | 'medium' | 'large'

const checkboxSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-4',
  medium: 'size-6',
  large: 'size-8',
}

const checkboxIconSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-3',
  medium: 'size-5',
  large: 'size-7',
}

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
  size?: CheckBoxSize,
  className?: string,
  containerClassName?: string,
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
                              size = 'medium',
                              className = '',
                              containerClassName
                            }: CheckboxProps) => {
  const usedSizeClass = checkboxSizeMapping[size]
  const innerIconSize = checkboxIconSizeMapping[size]

  const propagateChange = (checked: CheckedState) => {
    if (onChangeTristate) {
      onChangeTristate(checked)
    }
    if (onChange) {
      onChange(checked === 'indeterminate' ? false : checked)
    }
  }

  const changeValue = () => {
    const newValue = checked === 'indeterminate' ? false : !checked
    propagateChange(newValue)
  }

  return (
    <div className={clsx('row justify-center items-center', containerClassName)}>
      <CheckboxPrimitive.Root
        onCheckedChange={propagateChange}
        checked={checked}
        disabled={disabled}
        id={id}
        className={clsx(usedSizeClass, `items-center border-2 rounded outline-none focus:border-primary`, {
          'text-disabled-text border-disabled-text': disabled,
          'border-on-background': !disabled,
          'bg-primary/30 border-primary text-primary': checked === true || checked === 'indeterminate',
          'hover:border-gray-400 focus:hover:border-primary': !checked
        }, className)}
      >
        <CheckboxPrimitive.Indicator>
          {checked === true && <Check className={innerIconSize}/>}
          {checked === 'indeterminate' && <Minus className={innerIconSize}/>}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label &&
        <Label {...label} className={clsx('cursor-pointer', label.className)} htmlFor={id} onClick={changeValue}/>}
    </div>
  )
}

type UncontrolledCheckboxProps = Omit<CheckboxProps, 'value' | 'checked'> & {
  /**
   * @default false
   */
  defaultValue?: CheckedState,
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
