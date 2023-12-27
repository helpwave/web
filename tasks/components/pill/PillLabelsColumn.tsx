import { tw } from '@helpwave/common/twind'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { PillLabel, TaskState } from './PillLabel'

export type PillLabelsColumnProps = {
  unscheduledCount?: number,
  inProgressCount?: number,
  doneCount?: number
}

/**
 * A column showing the all TaskStates with a PillLabel for each
 */
const PillLabelsColumn = ({ unscheduledCount, inProgressCount, doneCount }: PillLabelsColumnProps) => {
  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <PillLabel count={unscheduledCount} state={TaskState[TaskStatus.TASK_STATUS_TODO]}/>
      <PillLabel count={inProgressCount} state={TaskState[TaskStatus.TASK_STATUS_IN_PROGRESS]}/>
      <PillLabel count={doneCount} state={TaskState[TaskStatus.TASK_STATUS_DONE]}/>
    </div>
  )
}

export { PillLabelsColumn }
