import type { LabelHTMLAttributes } from 'react'

export type LabelType = 'labelSmall' | 'labelMedium' | 'labelBig'
const styleMapping: Record<LabelType, string> = {
  labelSmall: 'textstyle-label-sm',
  labelMedium: 'textstyle-label-md',
  labelBig: 'textstyle-label-lg',
}


export type LabelProps = {
  /** The text for the label */
  name?: string,
  /** The styling for the label */
  labelType?: LabelType,
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
  return (
    <label {...props}>
      {children ? children : (<span className={styleMapping[labelType]}>{name}</span>)}
    </label>
  )
}
