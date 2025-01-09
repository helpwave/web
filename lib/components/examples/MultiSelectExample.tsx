import { useEffect, useState } from 'react'
import type { MultiSelectProps } from '../user-input/MultiSelect'
import { MultiSelect } from '../user-input/MultiSelect'
import { ChipList } from '../ChipList'

type MultiSelectExampleProps = Omit<MultiSelectProps<string>, 'search' | 'selectedDisplay'> & {
  enableSearch: boolean,
  useChipDisplay: boolean,
}

export const MultiSelectExample = ({
  options,
  hintText,
  enableSearch,
  onChange,
  useChipDisplay = false,
  ...props
}: MultiSelectExampleProps) => {
  const [usedOptions, setUsedOptions] = useState(options)

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options.map(value => ({ ...value, selected: false })))
  }, [hintText, options])

  return (
    <MultiSelect
      options={usedOptions}
      onChange={value => {
        onChange(value)
        setUsedOptions(value)
      }}
      hintText={hintText}
      search={enableSearch ? { initialSearch: '', searchMapping: value => [value.label] } : undefined}
      selectedDisplay={useChipDisplay ?
          ({ items }) => {
            const selected = items.filter(value => value.selected)
            if (selected.length === 0) {
              return (<span>Select</span>)
            }
            return (
            <ChipList
              list={selected.map(value => ({ children: value.label }))}
            />
            )
          } : undefined}
      {...props}
    />
  )
}
