import { useState } from 'react'
import { Search } from 'lucide-react'
import { MultiSearchWithMapping } from '../../util/simpleSearch'
import type { SelectOption, SelectProps } from './Select'
import { Select } from './Select'
import { Input } from './Input'

export type SearchableSelectProps<T> = SelectProps<T> & {
  searchMapping: (value: SelectOption<T>) => string[],
}

/**
 * A Select where items can be searched
 */
export const SearchableSelect = <T, >({
  value,
  options,
  searchMapping,
  ...selectProps
}: SearchableSelectProps<T>) => {
  const [search, setSearch] = useState<string>('')
  const filteredOptions = MultiSearchWithMapping(search, options, searchMapping)
  return (
    <Select
      value={value}
      options={filteredOptions}
      additionalItems={[(
        <div key="selectSearch" className="row gap-x-2 items-center">
          <Input autoFocus={true} value={search} onChange={setSearch} />
          <Search/>
        </div>
      )]}
      {...selectProps}
    />
  )
}
