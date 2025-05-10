
import { PillLabel } from './PillLabel'

export type PillLabelsColumnProps = {
  unscheduledCount?: number,
  inProgressCount?: number,
  doneCount?: number,
}

/**
 * A column showing the all TaskStates with a PillLabel for each
 */
const PillLabelsColumn = ({ unscheduledCount, inProgressCount, doneCount }: PillLabelsColumnProps) => {
  return (
    <div className="col gap-y-2">
      <PillLabel count={unscheduledCount} taskStatus="todo"/>
      <PillLabel count={inProgressCount} taskStatus="inProgress"/>
      <PillLabel count={doneCount} taskStatus="done"/>
    </div>
  )
}

export { PillLabelsColumn }
