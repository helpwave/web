import { tw, tx } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'

type ColumnTitleProps = {
  title: string,
  subtitle?: string
}

/**
 * A component for creating a uniform column title with the same bottom padding
 */
export const ColumnTitle = ({ title, subtitle }: ColumnTitleProps) => {
  return (
    <div className={tx('flex flex-col', { 'mb-8': subtitle === undefined, 'mb-4': subtitle !== undefined })}>
      <Span type="title">{title}</Span>
      <span className={tw('leading-4 text-gray-400')}>{subtitle}</span>
    </div>
  )
}
