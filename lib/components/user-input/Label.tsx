import type { LabelHTMLAttributes } from 'react'
import type { LabelType } from '../Span'
import { Span } from '../Span'

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
      {children ? children : (<Span type={labelType}>{name}</Span>)}
    </label>
  )
}
