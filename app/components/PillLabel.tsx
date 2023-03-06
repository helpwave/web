import { tw } from '@helpwave/common/twind/index'
import { TaskState } from '../enums/TaskState'

export type PillLabelProps = {
  count?: number,
  state?: TaskState
}

const PillLabel = ({ count = 0, state = TaskState.unscheduled }: PillLabelProps) => {
  const textMap = {
    [TaskState.unscheduled]: 'unscheduled',
    [TaskState.inProgress]: 'in progress',
    [TaskState.done]: 'done'
  }
  const labelMap = { [TaskState.unscheduled]: '1', [TaskState.inProgress]: '2', [TaskState.done]: '3' }

  const labelNumber = labelMap[state]
  const text = textMap[state]
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
