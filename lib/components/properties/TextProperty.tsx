import { Text } from 'lucide-react'
import clsx from 'clsx'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Textarea } from '../user-input/Textarea'
import { noop } from '../../util/noop'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type TextPropertyTranslation = {
  value: string,
}

const defaultTextPropertyTranslation: Record<Languages, TextPropertyTranslation> = {
  en: {
    value: 'Text'
  },
  de: {
    value: 'Text'
  }
}

export type TextPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: string,
  onChange?: (value: string) => void,
  onEditComplete?: (value: string) => void,
}

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  overwriteTranslation,
  value,
  readOnly,
  onChange = noop,
  onRemove = noop,
  onEditComplete = noop,
  ...baseProps
}: PropsForTranslation<TextPropertyTranslation, TextPropertyProps>) => {
  const translation = useTranslation(defaultTextPropertyTranslation, overwriteTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Text size={16} />}
      input={({ softRequired }) => (
        <div
          className={clsx('row grow pt-2 pb-1 px-4 cursor-pointer', { 'text-warning': softRequired && !hasValue })}
        >
          <Textarea
            className={clsx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !shadow-none !rounded-none', { 'bg-surface-warning placeholder-warning': softRequired && !hasValue })}
            rows={5}
            defaultStyle={false}
            value={value ?? ''}
            readOnly={readOnly}
            placeholder={`${translation.value}...`}
            onChange={(value) => {
              if (!value) {
                onRemove()
              } else {
                onChange(value)
              }
            }}
            onEditCompleted={(value) => {
              if (!value) {
                onRemove()
              } else {
                onEditComplete(value)
              }
            }}
          />
        </div>
      )}
    />
  )
}
