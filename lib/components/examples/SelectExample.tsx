import type { SelectProps } from '../user_input/Select'
import { Select } from '../user_input/Select'
import { useEffect, useState } from 'react'

type SelectExampleProps<T> = Omit<SelectProps<T>, 'onChange'>

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
