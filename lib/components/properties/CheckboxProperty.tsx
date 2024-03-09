import { ListTodo } from 'lucide-react'
import { tx } from '../../twind'
import { noop } from '../../util/noop'
import { Checkbox } from '../user-input/Checkbox'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type CheckboxPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: boolean,
  onChange?: (value: boolean) => void
}

/**
 * An Input for a boolen properties
 */
export const CheckboxProperty = ({
  value,
  onChange = noop,
  readOnly,
  ...baseProps
}: CheckboxPropertyProps) => {
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      readOnly={readOnly}
      icon={<ListTodo size={16}/>}
      input={({ softRequired }) => (
        <div
          className={tx('flex flex-row grow py-2 px-4 cursor-pointer justify-end', { 'text-hw-warn-600': softRequired && !hasValue })}
        >
          <Checkbox
            // TODO make bigger as in #904
            checked={value ?? 'indeterminate'}
            disabled={readOnly}
            onChange={onChange}
          />
        </div>
      )}
    />
  )
}
