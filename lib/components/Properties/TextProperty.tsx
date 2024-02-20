import { Text } from 'lucide-react'
import { tw, tx } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Textarea } from '../user-input/Textarea'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type TextPropertyTranslation = {
  value: string
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
  onRemove?: () => void
}

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  language,
  value,
  onChange,
  onRemove,
  ...baseProps
}: PropsWithLanguage<TextPropertyTranslation, TextPropertyProps>) => {
  const translation = useTranslation(language, defaultTextPropertyTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<Text size={16} />}
      input={({ required }) => (
        <div
          className={tx('flex flex-row grow pt-2 pb-1 px-4 cursor-pointer', { 'text-hw-warn-600': required && !hasValue })}
        >
          <Textarea
            outerClassName={tw('w-full')}
            // TODO consider the height and rows for dynamic sizing
            className={tx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !shadow-none !rounded-none', { 'bg-hw-warn-200 placeholder-hw-warn-500': required && !hasValue })}
            rows={5}
            defaultStyle={false}
            value={value?.toString() ?? ''}
            readOnly={!onChange}
            placeholder={`${translation.value}...`}
            onChange={(value) => {
              if (!value) {
                if (onRemove) {
                  onRemove()
                }
              } else {
                if (onChange) {
                  onChange(value)
                }
              }
            }}
            onEditCompleted={(value) => {
              if (!value) {
                if (onRemove) {
                  onRemove()
                }
              } else {
                if (onChange) {
                  onChange(value)
                }
              }
            }}
          />
        </div>
      )}
    />
  )
}
