import { useEffect, useState } from 'react'
import type { NumberPropertyProps } from '../../properties/NumberProperty'
import { NumberProperty } from '../../properties/NumberProperty'

export type NumberPropertyExampleProps = Omit<NumberPropertyProps, 'onChange' | 'onRemove'>

/**
 * Example for using the NumberProperty
 */
export const NumberPropertyExample = ({
  value,
  ...restProps
}: NumberPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<number | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <NumberProperty
      {...restProps}
      onChange={setUsedValue}
      onRemove={() => setUsedValue(undefined)}
      value={usedValue}
    />
  )
}
