import clsx from 'clsx'

type ColumnTitleProps = {
  title: string,
  subtitle?: string,
}

/**
 * A component for creating a uniform column title with the same bottom padding
 */
export const ColumnTitle = ({ title, subtitle }: ColumnTitleProps) => {
  return (
    <div className={clsx('col', { 'mb-8': subtitle === undefined, 'mb-4': subtitle !== undefined })}>
      <span className="textstyle-title-md">{title}</span>
      <span className="leading-4 text-gray-400">{subtitle}</span>
    </div>
  )
}
