import { useEffect, useState } from 'react'
import type { SearchableSelectProps } from '../user-input/SearchableSelect'
import { SearchableSelect } from '../user-input/SearchableSelect'

export type SearchableSelectExampleProps = Omit<SearchableSelectProps<string>, 'searchMapping'|'additionalItems'>

/**
 * Example for a Searchable select
 */
export const SearchableSelectExample = ({
  value,
  options,
  onChange,
  ...props
}: SearchableSelectExampleProps) => {
  const [selected, setSelected] = useState<string | undefined>(value)

  useEffect(() => {
    setSelected(options.find(value1 => value1.value === value)?.value)
  }, [options, value])

  return (
    <SearchableSelect
      {...props}
      value={selected}
      options={options}
      onChange={value => {
        setSelected(value)
        onChange(value)
      }}
      searchMapping={value1 => [value1.value]}
    />
  )
}
