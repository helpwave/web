import { tw } from '@helpwave/common/twind/index'

type ColumnTitleProps = {
  title: string
}

export const ColumnTitle = ({ title }: ColumnTitleProps) => {
  return (
    <div className={tw('mb-8')}>
      <span className={tw('text-xl font-space font-bold')}>{title}</span>
    </div>
  )
}
