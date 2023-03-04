import { tw } from '@helpwave/common/twind/index'

export type PillLabelProps = {
  count?: number,
  state?: 'unscheduled' | 'inProgress' | 'done'
}

const PillLabel = ({ count = 0, state = 'unscheduled' }: PillLabelProps) => {
  // case 'unscheduled' is default
  let labelNumber = '1'
  let text = 'unscheduled'
  switch (state) {
    case 'inProgress': labelNumber = '2'; text = 'in progress'; break
    case 'done': labelNumber = '3'; text = 'done'; break
    default: break
  }
  // TODO Translation
  return (
    <div className={tw(`flex flex-row w-2/3 px-2 rounded-md justify-between bg-hw-label-${labelNumber}-background`)}>
      <div className={tw(`flex flex-row items-center text-hw-label-${labelNumber}-text`)}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-${labelNumber}-accent`)} />
        <div className={tw('w-2')} />
        {text}
      </div>
      {count}
    </div>
  )
}

export { PillLabel }
