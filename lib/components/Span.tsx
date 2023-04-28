import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { tx } from '../twind'

export type SpanProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  type?: 'normal' | 'headline' | 'accent',
  className?: string
}

export const Span = ({ children, type = 'normal', className = '', ...restProps }: PropsWithChildren<SpanProps>) => {
  return (
    <span
      className={tx({
        'font-space': type === 'headline',
        'text-gray-700 font-bold': type === 'accent'
      },
      className)}
      {...restProps}
    >
      {children}
    </span>
  )
}
