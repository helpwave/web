import clsx from 'clsx'
import type { ReactNode } from 'react'

type ColumnTitleType = 'main' | 'subtitle'

type ColumnTitleProps = {
  title: ReactNode,
  description?: ReactNode,
  actions?: ReactNode,
  type?: ColumnTitleType,
  containerClassName?: string,
  titleRowClassName?: string,
}

/**
 * A component for creating a uniform column title with the same bottom padding
 */
export const ColumnTitle = ({
                              title,
                              actions,
                              description,
                              type = 'main',
                              containerClassName,
                              titleRowClassName,
                            }: ColumnTitleProps) => {
  return (
    <div className={clsx('col gap-y-0', containerClassName)}>
      <div className={clsx(
        'row justify-between items-center',
        {
          // TODO make these dependent on button heights
          'h-10': type === 'main',
          'h-8': type === 'subtitle',
        },
        titleRowClassName
      )}>
        {type === 'main' && <h2 className="textstyle-title-lg">{title}</h2>}
        {type === 'subtitle' && <h3 className="textstyle-title-md">{title}</h3>}
        {actions}
      </div>
      {description && (<span className="leading-4 text-description">{description}</span>)}
    </div>
  )
}
