import { List } from 'lucide-react'
import { tx } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import type { SearchableSelectProps } from '../user-input/SearchableSelect'
import { SearchableSelect } from '../user-input/SearchableSelect'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type SingleSelectPropertyTranslation = {
  select: string
}

const defaultSingleSelectPropertyTranslation: Record<Languages, SingleSelectPropertyTranslation> = {
  en: {
    select: 'Select'
  },
  de: {
    select: 'Auswählen'
  }
}

export type SingleSelectPropertyProps<T> =
  Omit<PropertyBaseProps & SearchableSelectProps<T>, 'icon' | 'input' | 'hasValue' | 'className' | 'disabled' | 'label' | 'labelClassName' | 'additionalItems'>
  & {
  onRemove?: () => void
}

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = <T, >({
  language,
  value,
  options,
  name,
  readOnly = false,
  softRequired,
  onRemove,
  // onRemove = noop,
  ...multiSelectProps
}: PropsWithLanguage<SingleSelectPropertyTranslation, SingleSelectPropertyProps<T>>) => {
  const translation = useTranslation(language, defaultSingleSelectPropertyTranslation)
  const hasValue = value !== undefined

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
          <SearchableSelect
            {...multiSelectProps}
            value={value}
            options={options}
            isDisabled={readOnly}
            className={tx('w-full', { 'bg-hw-warn-200': softRequired && !hasValue })}
            hintText={`${translation.select}...`}
          />
        </div>
      )}
    />
  )
}
