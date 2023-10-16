import { tw } from '../../twind'
import type { SelectOption, SelectProps } from './Select'
import { Select } from './Select'
import { useState } from 'react'
import { MultiSearchWithMapping } from '../../util/simpleSearch'
import { Input } from './Input'
import { Search } from 'lucide-react'

export type SearchableSelectProps<T> = Omit<SelectProps<T>, 'selectedDisplayOverwrite'> & {
  searchMapping: (value: SelectOption<T>) => string[]
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
      selectedDisplayOverwrite={options.find(option => option.value === value)?.label}
      additionalItems={[(
        <div key="selectSearch" className={tw('flex flex-row gap-x-2 items-center')}>
          <Input autoFocus={true} value={search} onChange={setSearch} />
          <Search/>
        </div>
      )]}
      {...selectProps}
    />
  )
}
