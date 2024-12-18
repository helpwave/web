import type { LabelHTMLAttributes } from 'react'

export type LabelType = 'labelSmall' | 'labelMedium' | 'labelBig'

export type LabelProps = {
  /** The text for the label */
  name?: string,
  /** The styling for the label */
  labelType?: LabelType
} & LabelHTMLAttributes<HTMLLabelElement>

/**
 * A Label component
 */
export const Label = ({
  children,
  name,
  labelType = 'labelSmall',
  ...props
}: LabelProps) => {
  const mapping:Record<LabelType, string> = {
    labelSmall: 'textstyle-label-sm',
    labelMedium: 'textstyle-label-md',
    labelBig: 'textstyle-label-lg',
  }

  return (
    <label {...props}>
      {children ? children : (<span className={mapping[labelType]}>{name}</span>)}
    </label>
  )
}
