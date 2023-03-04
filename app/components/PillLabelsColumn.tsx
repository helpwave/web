import { tw } from '@helpwave/common/twind/index'
import { PillLabel } from './PillLabel'

export type PillLabelsColumnProps = {
  unscheduledCount?: number,
  inProgressCount?: number,
  doneCount?: number
}

const PillLabelsColumn = ({ unscheduledCount = 0, inProgressCount = 0, doneCount = 0 }: PillLabelsColumnProps) => {
  return (
    <div className={tw('grid grid-rows-3 gap-y-2')}>
      <PillLabel count={unscheduledCount} state="unscheduled"/>
      <PillLabel count={inProgressCount} state="inProgress"/>
      <PillLabel count={doneCount} state="done"/>
    </div>
  )
}

export { PillLabelsColumn }
