import { Binary } from 'lucide-react'
import { tx } from '../../twind'
import { noop } from '../../util/noop'
import { Input } from '../user-input/Input'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
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
  suffix?: string,
  onChange?: (value: number) => void,
  onEditComplete?: (value: number) => void
}

/**
 * An Input for number properties
 */
export const NumberProperty = ({
  overwriteTranslation,
  value,
  onChange = noop,
  onRemove = noop,
  onEditComplete = noop,
  readOnly,
  suffix,
  ...baseProps
}: PropsForTranslation<NumberPropertyTranslation, NumberPropertyProps>) => {
  const translation = useTranslation(defaultNumberPropertyTranslation, overwriteTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Binary size={16}/>}
      input={({ softRequired }) => (
        <div
          className={tx('flex flex-row grow py-2 px-4 cursor-pointer', { 'text-hw-warn-600': softRequired && !hasValue })}
        >
          <Input
            expanded={false}
            className={tx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !w-fit !shadow-none !rounded-none', { 'bg-hw-warn-200 placeholder-hw-warn-500': softRequired && !hasValue })}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={readOnly}
            placeholder={`${translation.value}...`}
            onChange={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onChange(numberValue)
              }
            }}
            onEditCompleted={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onEditComplete(numberValue)
              }
            }}
          />
          {suffix && <Span className={tx('ml-1', { 'bg-hw-warn-200': softRequired && !hasValue })}>{suffix}</Span>}
        </div>
      )}
    />
  )
}
