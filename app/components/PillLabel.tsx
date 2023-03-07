import { tw } from '@helpwave/common/twind/index'
import type { TaskStateInformation } from '../dataclasses/TaskState'
import { TaskState } from '../dataclasses/TaskState'

export type PillLabelProps = {
  count?: number,
  state?: TaskStateInformation
}

const PillLabel = ({ count = 0, state = TaskState.unscheduled }: PillLabelProps) => {
  // TODO Translation
  return (
    <div className={tw(`flex flex-row pl-2 pr-3 py-1 rounded-lg justify-between
     bg-${state.colorLabel}-background text-${state.colorLabel}-text text-sm`)}>
      <div className={tw(`flex flex-row items-center text-${state.colorLabel}-text`)}>
        <div className={tw(`rounded-full w-2 h-2 bg-${state.colorLabel}-accent`)} />
        <div className={tw('w-2')} />
        {state.text}
      </div>
      {count}
    </div>
  )
}

export { PillLabel }
