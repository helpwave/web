import type { ReactNode } from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import type { Languages } from '../../hooks/useLanguage'
import { MultiSearchWithMapping } from '../../util/simpleSearch'
import clsx from 'clsx'
import { Menu, MenuItem } from './Menu'
import { Input } from './Input'
import { Checkbox } from './Checkbox'
import type { LabelProps } from './Label'
import { Label } from './Label'

type MultiSelectTranslation = {
  select: string,
  search: string,
  selected: string,
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
  className?: string,
}

export type SearchProps<T> = {
  initialSearch?: string,
  searchMapping: (value: MultiSelectOption<T>) => string[],
}

export type MultiSelectProps<T> = {
  options: MultiSelectOption<T>[],
  onChange: (options: MultiSelectOption<T>[]) => void,
  search?: SearchProps<T>,
  disabled?: boolean,
  selectedDisplay?: (props: {
    items: MultiSelectOption<T>[],
    disabled: boolean,
  }) => ReactNode,
  label?: LabelProps,
  hintText?: string,
  showDisabledOptions?: boolean,
  className?: string,
  triggerClassName?: string,
}

/**
 * A Component for multi selection
 */
export const MultiSelect = <T, >({
                                   overwriteTranslation,
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
                                 }: PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>) => {
  const translation = useTranslation(defaultMultiSelectTranslation, overwriteTranslation)
  const [searchText, setSearchText] = useState<string>(search?.initialSearch ?? '')
  let filteredOptions: MultiSelectOption<T>[] = options
  const enableSearch = !!search
  if (enableSearch && !!searchText) {
    filteredOptions = MultiSearchWithMapping<MultiSelectOption<T>>(
      searchText,
      filteredOptions,
      value => search.searchMapping(value)
    )
  }
  if (!showDisabledOptions) {
    filteredOptions = filteredOptions.filter(value => !value.disabled)
  }

  const selectedItems = options.filter(value => value.selected)
  const menuButtonText = selectedItems.length === 0 ?
    hintText ?? translation.select
    : <span>{`${selectedItems.length} ${translation.selected}`}</span>

  const borderColor = 'border-menu-border'

  return (
    <div className={clsx(className)}>
      {label && (
        <Label {...label} htmlFor={label.name} className={clsx(' mb-1', label.className)}
               labelType={label.labelType ?? 'labelBig'}/>
      )}
      <Menu<HTMLDivElement>
        alignment="t_"
        trigger={(onClick, ref) => (
          <div ref={ref} onClick={disabled ? undefined : onClick}
               className={clsx(borderColor, 'bg-menu-background text-menu-text inline-w-full justify-between items-center rounded-lg border-2 px-4 py-2 font-medium',
                 {
                   'hover:brightness-90 hover:border-primary cursor-pointer': !disabled,
                   'bg-disabled-background text-disabled cursor-not-allowed': disabled
                 },
                 triggerClassName)}
          >
            {selectedDisplay ? selectedDisplay({ items: options, disabled }) : menuButtonText}
          </div>
        )}
        menuClassName={clsx(
          '!rounded-lg !shadow-lg !max-h-[500px] !min-w-[400px] !max-w-[70vh] !overflow-y-auto !border !border-2', borderColor,
          { '!py-0': !enableSearch, '!pb-0': enableSearch }
        )}
      >
        {enableSearch && (
          <div key="selectSearch" className="row gap-x-2 items-center px-2 py-2">
            <Input autoFocus={true} value={searchText} onChange={setSearchText}/>
            <Search/>
          </div>
        )}
        {filteredOptions.map((option, index) => (
          <MenuItem key={`item${index}`} className={clsx({
            'cursor-not-allowed !bg-disabled-background !text-disabled-text hover:brightness-100': !!option.disabled,
            'cursor-pointer': !option.disabled,
          })}
          >
            <div
              className={clsx('overflow-hidden whitespace-nowrap text-ellipsis row items-center gap-x-2', option.className)}
              onClick={() => {
                if (!option.disabled) {
                  onChange(options.map(value => value.value === option.value ? ({
                    ...option,
                    selected: !value.selected
                  }) : value))
                }
              }}
            >
              <Checkbox checked={option.selected} disabled={option.disabled} size="small"/>
              {option.label}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
