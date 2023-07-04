import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { PillLabelBox } from '../pill/PillLabelBox'
import { Bed, Edit } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { Span } from '@helpwave/common/components/Span'
import type { WardInOrganizationOverviewDTO } from '../../mutations/ward_mutations'

type WardCardTranslation = {
  edit: string,
  noRoomsYet: string
}

const defaultWardCardTranslations: Record<Languages, WardCardTranslation> = {
  en: {
    edit: 'Edit',
    noRoomsYet: 'no rooms yet'
  },
  de: {
    edit: 'Bearbeiten',
    noRoomsYet: 'noch keine Räume'
  }
}

type Room = {
  bedCount: number,
  name: string
}

export type WardCardProps = CardProps & {
  ward: WardInOrganizationOverviewDTO,
  onEditClick?: () => void
}

/**
 * A Card showing the information about a ward
 */
export const WardCard = ({
  language,
  isSelected,
  ward,
  onTileClick = () => undefined,
  onEditClick
}: PropsWithLanguage<WardCardTranslation, WardCardProps>) => {
  const translation = useTranslation(language, defaultWardCardTranslations)
  const hasRooms = ward.bedCount > 0

  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group cursor-pointer')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <Span type="subsubsectionTitle">{ward.name}</Span>
        {onEditClick && (
          <button
            onClick={event => {
              onEditClick()
              event.stopPropagation()
            }}
            className={tw('hidden group-hover:block')}
          >
            <Edit color="black" size={24}/>
          </button>
        )}
      </div>
      {
        !hasRooms && (
          <div className={tx('text-left my-1 truncate text-gray-400 text-sm')}>
            {translation.noRoomsYet}
          </div>
        )
      }
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
