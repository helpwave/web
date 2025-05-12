import { List } from 'lucide-react'
import clsx from 'clsx'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import type { SearchableSelectProps } from '../user-input/SearchableSelect'
import { SearchableSelect } from '../user-input/SearchableSelect'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type SingleSelectPropertyTranslation = {
  select: string,
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

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = <T, >({
  overwriteTranslation,
  value,
  options,
  name,
  readOnly = false,
  softRequired,
  onRemove,
  ...multiSelectProps
}: PropsForTranslation<SingleSelectPropertyTranslation, SingleSelectPropertyProps<T>>) => {
  const translation = useTranslation(defaultSingleSelectPropertyTranslation, overwriteTranslation)
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
          className={clsx('row grow py-2 px-4 cursor-pointer', { 'text-warning': softRequired && !hasValue })}
        >
          <SearchableSelect
            {...multiSelectProps}
            value={value}
            options={options}
            isDisabled={readOnly}
            className={clsx('w-full', { 'bg-surface-warning': softRequired && !hasValue })}
            hintText={`${translation.select}...`}
          />
        </div>
      )}
    />
  )
}
