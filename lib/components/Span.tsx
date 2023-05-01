import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { tx } from '../twind'

export type SpanProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  type?: 'normal' | 'title' | 'subsectionTitle' | 'subsubsectionTitle' | 'accent' | 'description' | 'label' | 'tableName',
  className?: string
}

export const Span = ({ children, type = 'normal', className = '', ...restProps }: PropsWithChildren<SpanProps>) => {
  return (
    <span
      className={tx({
        'text-xl font-space font-bold': type === 'title',
        'font-semibold text-lg': type === 'subsectionTitle',
        'font-space font-bold': type === 'subsubsectionTitle',
        'text-sm text-gray-600 font-bold': type === 'accent',
        'text-gray-400': type === 'description',
        'text-sm text-gray-700 font-medium': type === 'label',
        'text-lg font-space font-medium': type === 'tableName'
      },
      className)}
      {...restProps}
    >
      {children}
    </span>
  )
}
