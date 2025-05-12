import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import type { Languages } from '../../hooks/useLanguage'
import { TextButton } from '../Button'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

type PropertyBaseTranslation = {
  remove: string,
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
  onRemove?: () => void,
  hasValue: boolean,
  softRequired?: boolean,
  readOnly?: boolean,
  icon?: ReactNode,
  className?: string,
}

/**
 * A component for showing a properties with uniform styling
 */
export const PropertyBase = ({
  overwriteTranslation,
  name,
  input,
  softRequired = false,
  hasValue,
  icon,
  readOnly,
  onRemove,
  className = '',
}: PropsForTranslation<PropertyBaseTranslation, PropertyBaseProps>) => {
  const translation = useTranslation(defaultPropertyBaseTranslation, overwriteTranslation)
  const requiredAndNoValue = softRequired && !hasValue
  return (
    <div className={clsx('row gap-x-0 group', className)}>
      <div
        className={
          clsx('row gap-x-2 !w-[200px] px-4 py-2 items-center rounded-l-xl border-2 border-r-0', {
            'bg-gray-100 text-black group-hover:border-primary border-gray-400': !requiredAndNoValue,
            'bg-warning text-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className)}
      >
        {icon}
        {name}
      </div>
      <div className={
        clsx('row grow justify-between items-center rounded-r-xl border-2 border-l-0', {
          'bg-white group-hover:border-primary border-gray-400': !requiredAndNoValue,
          'bg-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
        }, className)}
      >
        {input({ softRequired, hasValue })}
        {requiredAndNoValue && (
          <div className="text-warning pr-4"><AlertTriangle size={24}/></div>
        )}
        {onRemove && (
          <TextButton
            onClick={onRemove}
            color="negative"
            className={clsx('pr-4 items-center', { '!text-transparent': !hasValue || readOnly })}
            disabled={!hasValue || readOnly}
          >
            {translation.remove}
          </TextButton>
        )}
      </div>
    </div>
  )
}
