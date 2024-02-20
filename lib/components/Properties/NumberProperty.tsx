import { Binary } from 'lucide-react'
import { tx } from '../../twind'
import { Input } from '../user-input/Input'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Span } from '../Span'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type NumberPropertyTranslation = {
  value: string
}

const defaultNumberPropertyTranslation: Record<Languages, NumberPropertyTranslation> = {
  en: {
    value: 'Value'
  },
  de: {
    value: 'Wert'
  }
}

export type NumberPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: number,
  suffix: string,
  onChange?: (value: number) => void,
  onRemove?: () => void
}

/**
 * An Input for number properties
 */
export const NumberProperty = ({
  language,
  value,
  onChange,
  onRemove,
  suffix,
  ...baseProps
}: PropsWithLanguage<NumberPropertyTranslation, NumberPropertyProps>) => {
  const translation = useTranslation(language, defaultNumberPropertyTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<Binary size={16} />}
      input={({ required }) => (
        <div
          className={tx('flex flex-row grow py-2 px-4 cursor-pointer', { 'text-hw-warn-600': required && !hasValue })}
        >
          <Input
            expanded={false}
            className={tx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !w-fit !shadow-none !rounded-none', { 'bg-hw-warn-200 placeholder-hw-warn-500': required && !hasValue })}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={!onChange}
            placeholder={`${translation.value}...`}
            onChange={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                if (onRemove) {
                  onRemove()
                }
              } else {
                if (onChange) {
                  onChange(numberValue)
                }
              }
            }}
            onEditCompleted={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                if (onRemove) {
                  onRemove()
                }
              } else {
                if (onChange) {
                  onChange(numberValue)
                }
              }
            }}
          />
          <Span className={tx('ml-1', { 'bg-hw-warn-200': required && !hasValue })}>{suffix}</Span>
        </div>
      )}
    />
  )
}
