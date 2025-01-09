import { tx } from '../twind'
import type { NativeProps } from '../util/types'

export type LabelType = 'labelSmall' | 'labelMedium' | 'labelBig'

export type SpanType = LabelType | 'normal' | 'heading' | 'title' | 'subsectionTitle' | 'subsubsectionTitle' | 'accent'
  | 'description' | 'tableName' | 'navigationItem' | 'tableHeader' | 'formError'
  | 'formDescription' | 'modalTitle' | 'block'

export type SpanProps = NativeProps<'span'> & {
  type?: SpanType,
}

/**
 * A component for displaying text and making it easy to change the style
 *
 * The type of text is defined by the type attribute
 */
export const Span = ({ children, type = 'normal', className, ...restProps }: SpanProps) => {
  return (
    <span
      className={tx({
        'text-2xl font-space font-bold': type === 'heading',
        'text-xl font-space font-bold': type === 'title',
        'font-semibold text-lg': type === 'subsectionTitle' || type === 'modalTitle',
        'font-space font-bold': type === 'subsubsectionTitle',
        'text-sm text-gray-600 font-bold': type === 'accent',
        'text-gray-400': type === 'description',
        'text-sm text-gray-700 font-semibold': type === 'labelSmall',
        'text-gray-700 font-semibold': type === 'labelMedium',
        'text-lg font-semibold': type === 'labelBig',
        'text-lg font-space font-medium': type === 'tableName',
        'text-lg font-space font-normal': type === 'navigationItem',
        'text-gray-600 font-bold': type === 'tableHeader',
        'text-hw-negative-500 text-sm': type === 'formError',
        'text-gray-500 text-sm': type === 'formDescription',
        'text-justify': type === 'block'
      },
      className)}
      {...restProps}
    >
      {children}
    </span>
  )
}
