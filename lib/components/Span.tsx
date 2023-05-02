import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { tx } from '../twind'

export type SpanProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  type?: 'normal' | 'title' | 'subsectionTitle' | 'subsubsectionTitle' | 'accent' | 'description' | 'label' | 'tableName' | 'tableHeader' | 'formError' | 'formDescription',
  className?: string
}

/**
 * A component for displaying text and making it easy to change the style
 *
 * The type of text is defined by the type attribute
 */
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
        'text-lg font-space font-medium': type === 'tableName',
        'text-gray-600 font-bold': type === 'tableHeader',
        'text-hw-negative-500 text-sm': type === 'formError',
        'text-gray-500 text-sm': type === 'formDescription'
      },
      className)}
      {...restProps}
    >
      {children}
    </span>
  )
}
