import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { tw, tx } from '../../twind'

export type PropertyBaseProps = {
  name: string,
  input: (props: { softRequired: boolean, hasValue: boolean }) => ReactNode,
  hasValue: boolean,
  softRequired?: boolean,
  readonly?: boolean,
  icon?: ReactNode,
  className?: string
}

/**
 * A component for showing a property with uniform styling
 */
export const PropertyBase = ({
  name,
  input,
  softRequired = false,
  hasValue,
  icon,
  className = '',
}: PropertyBaseProps) => {
  const requiredAndNoValue = softRequired && !hasValue
  return (
    <div
      className={tx('flex flex-row border border-2 rounded-xl overflow-hidden', {
        'hover:border-hw-primary-800 border-gray-400 ': !requiredAndNoValue,
        'hover:border-hw-warn-800 border-hw-warn-700': requiredAndNoValue,
      }, className)}
    >
      <div
        className={
          tx('flex flex-row gap-x-2 min-w-[200px] overflow-hidden px-4 py-2 items-center', {
            'bg-gray-200 text-black': !requiredAndNoValue,
            'bg-hw-warn-600 text-hw-warn-100': requiredAndNoValue,
          }, className)}
      >
        {icon}
        {name}
      </div>
      <div className={
        tx('flex grow gap-x-4 pr-4 justify-between items-center', {
          'bg-white': !requiredAndNoValue,
          'bg-hw-warn-200': requiredAndNoValue,
        }, className)}
      >
        {input({ softRequired, hasValue })}
        {softRequired && !hasValue && (
          <div className={tw('text-hw-warn-600')}><AlertTriangle size={24}/></div>)
        }
      </div>
    </div>
  )
}
