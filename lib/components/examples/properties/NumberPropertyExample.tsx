import { useEffect, useState } from 'react'
import type { NumberPropertyProps } from '../../Properties/NumberProperty'
import { NumberProperty } from '../../Properties/NumberProperty'

export type NumberPropertyExampleProps = Omit<NumberPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean
}

/**
 * Example for using the NumberProperty
 */
export const NumberPropertyExample = ({
  value,
  readOnly,
  ...restProps
}: NumberPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<number | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <NumberProperty
      {...restProps}
      onChange={readOnly ? undefined : setUsedValue}
      onRemove={readOnly ? undefined : () => setUsedValue(undefined)}
      value={usedValue}
    />
  )
}
