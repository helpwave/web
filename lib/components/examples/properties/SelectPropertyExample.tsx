import { useEffect, useState } from 'react'
import type { SingleSelectPropertyProps } from '../../properties/SelectProperty'
import { SingleSelectProperty } from '../../properties/SelectProperty'

export type SingleSelectPropertyExample = Omit<SingleSelectPropertyProps<string>, 'onChange' | 'onRemove'|'searchMapping'>

/**
 * Example for using the SingleSelectProperty
 */
export const SingleSelectPropertyExample = ({
  value,
  options,
  hintText,
  ...restProps
}: SingleSelectPropertyExample) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  useEffect(() => {
    setUsedValue(undefined)
  }, [hintText])

  useEffect(() => {
    if (options.find(value1 => value1.value === value)) {
      setUsedValue(value)
    }
  }, [value, options])

  return (
    <SingleSelectProperty
      {...restProps}
      value={usedValue}
      options={options}
      searchMapping={value1 => [value1.value]}
      onChange={setUsedValue}
      onRemove={() => setUsedValue(undefined)}
      hintText={hintText}
    />
  )
}
