import { tw } from '@helpwave/common/twind/index'
import { PillLabel } from './PillLabel'
import { TaskStates } from '../dataclasses/TaskState'

export type PillLabelsColumnProps = {
  unscheduledCount?: number,
  inProgressCount?: number,
  doneCount?: number
}

const PillLabelsColumn = ({ unscheduledCount = 0, inProgressCount = 0, doneCount = 0 }: PillLabelsColumnProps) => {
  return (
    <div className={tw('grid grid-rows-3 gap-y-2')}>
      <PillLabel count={unscheduledCount} state={TaskStates.unscheduled}/>
      <PillLabel count={inProgressCount} state={TaskStates.inProgress}/>
      <PillLabel count={doneCount} state={TaskStates.done}/>
    </div>
  )
}

export { PillLabelsColumn }
