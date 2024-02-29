import type { ReactNode } from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import type { Languages } from '../../hooks/useLanguage'
import { MultiSearchWithMapping } from '../../util/simpleSearch'
import { tx, tw } from '../../twind'
import type { LabelType } from '../Span'
import { Span } from '../Span'
import { Menu, MenuItem } from './Menu'
import { Input } from './Input'
import { Checkbox } from './Checkbox'

type MultiSelectTranslation = {
  select: string,
  search: string,
  selected: string
}

const defaultMultiSelectTranslation: Record<Languages, MultiSelectTranslation> = {
  en: {
    select: 'Select',
    search: 'Search',
    selected: 'selected'
  },
  de: {
    select: 'Auswählen',
    search: 'Suche',
    selected: 'ausgewählt'
  }
}

// TODO maybe add custom item builder here
export type MultiSelectOption<T> = {
  label: string,
  value: T,
  selected: boolean,
  disabled?: boolean,
  className?: string
}

export type SearchProps<T> = {
  initialSearch?: string,
  searchMapping: (value: MultiSelectOption<T>) => string[]
}

export type MultiSelectProps<T> = {
  options: MultiSelectOption<T>[],
  onChange: (options: MultiSelectOption<T>[]) => void,
  search?: SearchProps<T>,
  disabled?: boolean,
  selectedDisplay?: (props: {
    items: MultiSelectOption<T>[],
    disabled: boolean
  }) => ReactNode,
  label?: string,
  hintText?: string,
  showDisabledOptions?: boolean,
  className?: string,
  triggerClassName?: string,
  labelType?: LabelType
}

/**
 * A Component for multi selection
 */
export const MultiSelect = <T, >({
  language,
  options,
  onChange,
  search,
  disabled = false,
  selectedDisplay,
  label,
  hintText,
  showDisabledOptions = true,
  className = '',
  triggerClassName = '',
  labelType = 'labelBig',
}: PropsWithLanguage<MultiSelectTranslation, MultiSelectProps<T>>) => {
  const translation = useTranslation(language, defaultMultiSelectTranslation)
  const [searchText, setSearchText] = useState<string>(search?.initialSearch ?? '')
  let filteredOptions: MultiSelectOption<T>[] = options
  const enableSearch = !!search
  if (enableSearch && !!searchText) {
    filteredOptions = MultiSearchWithMapping<MultiSelectOption<T>>(
      searchText,
      filteredOptions,
      value => search.searchMapping(value))
  }
  if (!showDisabledOptions) {
    filteredOptions = filteredOptions.filter(value => !value.disabled)
  }

  const selectedItems = options.filter(value => value.selected)
  const menuButtonText = selectedItems.length === 0 ?
    hintText ?? translation.select
    : <Span>{`${selectedItems.length} ${translation.selected}`}</Span>

  return (
    <div className={tx(className)}>
      {label && (
        <label htmlFor={label} className={tw(' mb-1')}>
          <Span type={labelType}>{label}</Span>
        </label>
      )}
      <Menu<HTMLDivElement>
        alignment="t_"
        trigger={(onClick, ref) => (
          <div ref={ref} onClick={disabled ? undefined : onClick}
               className={tx('inline-flex w-full justify-between items-center rounded-lg border-2 px-4 py-2 font-medium cursor-pointer',
                 {
                   'hover:bg-gray-100': !disabled,
                   'bg-gray-100 cursor-not-allowed text-gray-500': disabled
                 },
                 triggerClassName
               )}
          >
            {selectedDisplay ? selectedDisplay({ items: options, disabled }) : menuButtonText}
          </div>
        )}
        menuClassName={tx(
          '!rounded-lg !shadow-lg !max-h-[500px] !min-w-[400px] !max-w-[70vh] !overflow-y-auto !border !border-2',
          { '!py-0': !enableSearch, '!pb-0': enableSearch }
        )}
      >
        {enableSearch && (
          <div key="selectSearch" className={tw('flex flex-row gap-x-2 items-center px-4 py-2')}>
            <Input autoFocus={true} value={searchText} onChange={setSearchText}/>
            <Search/>
          </div>
        )}
        {filteredOptions.map((option, index) => (
          <MenuItem key={`item${index}`}>
            <div
              className={tx('px-4 py-2 overflow-hidden whitespace-nowrap text-ellipsis flex flex-row gap-x-2',
                option.className, {
                  'text-gray-300 cursor-not-allowed': !!option.disabled,
                  'hover:bg-gray-100 cursor-pointer': !option.disabled,
                })}
              onClick={() => {
                if (!option.disabled) {
                  onChange(options.map(value => value.value === option.value ? ({
                    ...option,
                    selected: !value.selected
                  }) : value))
                }
              }}
            >
              <Checkbox checked={option.selected} disabled={option.disabled}/>
              {option.label}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
