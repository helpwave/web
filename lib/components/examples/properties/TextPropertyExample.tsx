import { useEffect, useState } from 'react'
import type { TextPropertyProps } from '../../Properties/TextProperty'
import { TextProperty } from '../../Properties/TextProperty'

export type TextPropertyExampleProps = Omit<TextPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean
}

/**
 * Example for using the TextProperty
 */
export const TextPropertyExample = ({
  value,
  readOnly,
  ...restProps
}: TextPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <TextProperty
      {...restProps}
      onChange={readOnly ? undefined : setUsedValue}
      onRemove={readOnly ? undefined : () => setUsedValue(undefined)}
      value={usedValue}
    />
  )
}
