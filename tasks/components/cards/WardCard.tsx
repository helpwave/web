import { tw } from '@helpwave/common/twind'
import { PillLabelBox } from '../pill/PillLabelBox'
import { Bed, Edit } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Span } from '@helpwave/common/components/Span'
import type { WardOverviewDTO } from '../../mutations/ward_mutations'

export type WardCardProps = CardProps & {
  ward: WardOverviewDTO,
  onEditClick?: () => void
}

/**
 * A Card showing the information about a ward
 */
export const WardCard = ({
  isSelected,
  ward,
  onTileClick = () => undefined,
  onEditClick
}: WardCardProps) => {
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group cursor-pointer')}>
      <div className={tw('flex flex-row w-full mb-2 gap-x-2 overflow-hidden')}>
        <Span type="subsubsectionTitle" className={tw('flex-1 truncate')}>{ward.name}</Span>
        {onEditClick && (
          <button
            onClick={event => {
              onEditClick()
              event.stopPropagation()
            }}
            className={tw('text-transparent group-hover:text-black')}
          >
            <Edit size={24}/>
          </button>
        )}
      </div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row')}>
          <Bed/>
          <div className={tw('pl-1')}>{ward.bedCount}</div>
        </div>
        <PillLabelBox
          unscheduled={ward.unscheduled}
          inProgress={ward.inProgress}
          done={ward.done}
        />
      </div>
    </Card>
  )
}
