import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { tw, tx } from '../../twind'
import { noop } from '../../util/noop'
import type { Languages } from '../../hooks/useLanguage'
import { Button } from '../Button'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

type PropertyBaseTranslation = {
  remove: string
}

const defaultPropertyBaseTranslation: Record<Languages, PropertyBaseTranslation> = {
  en: {
    remove: 'Remove'
  },
  de: {
    remove: 'Entfernen'
  }
}

export type PropertyBaseProps = {
  name: string,
  input: (props: { softRequired: boolean, hasValue: boolean }) => ReactNode,
  onRemove: () => void,
  hasValue: boolean,
  softRequired?: boolean,
  readOnly?: boolean,
  icon?: ReactNode,
  className?: string
}

/**
 * A component for showing a property with uniform styling
 */
export const PropertyBase = ({
  overwriteTranslation,
  name,
  input,
  softRequired = false,
  hasValue,
  icon,
  readOnly,
  onRemove = noop,
  className = '',
}: PropsForTranslation<PropertyBaseTranslation, PropertyBaseProps>) => {
  const translation = useTranslation(overwriteTranslation, defaultPropertyBaseTranslation)
  const requiredAndNoValue = softRequired && !hasValue
  return (
    <div
      className={tx('flex flex-row border border-2 rounded-[16px]', {
        'hover:border-hw-primary-800 border-gray-400 ': !requiredAndNoValue,
        'hover:border-hw-warn-800 border-hw-warn-700': requiredAndNoValue,
      }, className)}
    >
      <div
        className={
          tx('flex flex-row gap-x-2 min-w-[200px] overflow-hidden px-4 py-2 items-center rounded-l-[14px]', {
            'bg-gray-200 text-black': !requiredAndNoValue,
            'bg-hw-warn-600 text-hw-warn-100': requiredAndNoValue,
          }, className)}
      >
        {icon}
        {name}
      </div>
      <div className={
        tx('flex grow justify-between items-center rounded-r-[14px]', {
          'bg-white': !requiredAndNoValue,
          'bg-hw-warn-200': requiredAndNoValue,
        }, className)}
      >
        {input({ softRequired, hasValue })}
        {requiredAndNoValue && (
          <div className={tw('text-hw-warn-600 pr-4')}><AlertTriangle size={24}/></div>
        )}
        {hasValue && !readOnly && (
          <Button onClick={onRemove} color="negative" variant="textButton" className={tw('pr-4')}>
            {translation.remove}
          </Button>
        )}
      </div>
    </div>
  )
}
