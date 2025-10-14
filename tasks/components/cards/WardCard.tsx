import clsx from 'clsx'
import { Bed } from 'lucide-react'
import type { WardOverviewDTO } from '@helpwave/api-services/types/tasks/wards'
import { PillLabelBox } from '../PillLabel'
import { EditCard, type EditCardProps } from './EditCard'

export type WardCardProps = EditCardProps & {
  ward: WardOverviewDTO,
}

/**
 * A Card showing the information about a ward
 */
export const WardCard = ({
  ward,
  className,
  ...editCardProps
}: WardCardProps) => {
  return (
    <EditCard className={clsx('group cursor-pointer', className)} {...editCardProps}>
      <div className="flex-col-2 justify-between">
        <div className="row w-full overflow-hidden">
          <span className="typography-title-md flex-1 truncate">{ward.name}</span>
        </div>
        <div className="row gap-x-1">
          <Bed/>
          <span>{ward.bedCount}</span>
        </div>
        <PillLabelBox
          unscheduled={ward.unscheduled}
          inProgress={ward.inProgress}
          done={ward.done}
        />
      </div>
    </EditCard>
  )
}
