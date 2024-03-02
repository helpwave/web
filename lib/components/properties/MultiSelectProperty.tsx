import { List } from 'lucide-react'
import { tx } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import type { MultiSelectProps } from '../user-input/MultiSelect'
import { MultiSelect } from '../user-input/MultiSelect'
import { Span } from '../Span'
import { ChipList } from '../ChipList'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type MultiSelectPropertyTranslation = {
  select: string
}

const defaultMultiSelectPropertyTranslation: Record<Languages, MultiSelectPropertyTranslation> = {
  en: {
    select: 'Select'
  },
  de: {
    select: 'Auswählen'
  }
}

export type MultiSelectPropertyProps<T> =
  Omit<PropertyBaseProps & MultiSelectProps<T>, 'icon' | 'input' | 'hasValue' | 'className' | 'disabled' | 'label' | 'triggerClassName'>

/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = <T, >({
  language,
  options,
  name,
  readOnly = false,
  softRequired,
  onRemove,
  ...multiSelectProps
}: PropsWithLanguage<MultiSelectPropertyTranslation, MultiSelectPropertyProps<T>>) => {
  const translation = useTranslation(language, defaultMultiSelectPropertyTranslation)
  const hasValue = options.some(value => value.selected)
  let triggerClassName: string
  if (softRequired && !hasValue) {
    triggerClassName = '!border-hw-warn-600 !hover:border-hw-warn-700 !hover:bg-hw-warn-300 !hover:text-hw-warn-700'
  }

  return (
    <PropertyBase
      name={name}
      onRemove={onRemove}
      readOnly={readOnly}
      softRequired={softRequired}
      hasValue={hasValue}
      icon={<List size={16}/>}
      input={({ softRequired }) => (
        <div
          className={tx('flex flex-row grow py-2 px-4 cursor-pointer', { 'text-hw-warn-600': softRequired && !hasValue })}
        >
          <MultiSelect
            {...multiSelectProps}
            className={tx('w-full', { 'bg-hw-warn-200': softRequired && !hasValue })}
            triggerClassName={triggerClassName}
            selectedDisplay={({ items }) => {
              const selected = items.filter(value => value.selected)
              if (selected.length === 0) {
                return <Span>Select</Span>
              }
              return (
                <ChipList
                  list={selected.map(value => ({ label: value.label }))}
                />
              )
            }}
            options={options}
            disabled={readOnly}
            hintText={`${translation.select}...`}
          />
        </div>
      )}
    />
  )
}
