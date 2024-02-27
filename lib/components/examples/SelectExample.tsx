import { useEffect, useState } from 'react'
import { Select, type SelectProps } from '../user-input/Select'

type SelectExampleProps<T> = Omit<SelectProps<T>, 'onChange' | 'additionalItems' | 'selectedDisplayOverwrite'>

export const SelectExample = <T, >({ options, value, hintText, ...props }: SelectExampleProps<T>) => {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    if (options.find(options => options.value === value)) {
      setSelected(value)
    }
  }, [options, value])

  useEffect(() => {
    setSelected(undefined)
  }, [hintText])

  return (
    <Select
      value={selected}
      options={options}
      onChange={value => setSelected(value)}
      hintText={hintText}
      {...props}
    />
  )
}
