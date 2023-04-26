import { tw, tx } from '@helpwave/common/twind'

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
      <span className={tw('text-xl font-space font-bold')}>{title}</span>
      <span className={tw('leading-4 text-gray-400')}>{subtitle}</span>
    </div>
  )
}
