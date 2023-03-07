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
    <div className={tw(`flex flex-row w-2/3 px-2 rounded-md justify-between bg-hw-label-${state.label}-background`)}>
      <div className={tw(`flex flex-row items-center text-hw-label-${state.label}-text`)}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-${state.label}-accent`)} />
        <div className={tw('w-2')} />
        {state.text}
      </div>
      {count}
    </div>
  )
}

export { PillLabel }
