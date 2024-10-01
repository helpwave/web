import { tw, tx } from '@helpwave/common/twind'
import { Bed } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import type { WardOverviewDTO } from '@helpwave/api-services/types/tasks/wards'
import { PillLabelBox } from '../pill/PillLabelBox'
import { EditCard, type EditCardProps } from './EditCard'

export type WardCardProps = EditCardProps & {
  ward: WardOverviewDTO
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
    <EditCard className={tx('group cursor-pointer', className)} {...editCardProps}>
      <div className={tw('flex flex-col gap-y-2')}>
        <div className={tw('flex flex-row w-full overflow-hidden')}>
          <Span type="subsubsectionTitle" className={tw('flex-1 truncate')}>{ward.name}</Span>
        </div>
        <div className={tw('flex flex-row gap-x-1')}>
          <Bed/>
          <Span>{ward.bedCount}</Span>
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
