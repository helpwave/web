import { useEffect, useState } from 'react'
import type { TextPropertyProps } from '../../properties/TextProperty'
import { TextProperty } from '../../properties/TextProperty'

export type TextPropertyExampleProps = Omit<TextPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean,
}

/**
 * Example for using the TextProperty
 */
export const TextPropertyExample = ({
  value,
  ...restProps
}: TextPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <TextProperty
      {...restProps}
      onChange={setUsedValue}
      onRemove={() => setUsedValue(undefined)}
      value={usedValue}
    />
  )
}
