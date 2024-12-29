import { useEffect, useState } from 'react'
import type { CheckboxPropertyProps } from '../../properties/CheckboxProperty'
import { CheckboxProperty } from '../../properties/CheckboxProperty'

export type CheckboxPropertyExampleProps = Omit<CheckboxPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean,
}

/**
 * Example for using the CheckboxProperty
 */
export const CheckboxPropertyExample = ({
  value = false,
  ...restProps
}: CheckboxPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<boolean>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <CheckboxProperty
      {...restProps}
      onChange={setUsedValue}
      value={usedValue}
    />
  )
}
