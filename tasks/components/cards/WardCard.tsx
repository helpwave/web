import { tx, tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { PillLabelBox } from '../pill/PillLabelBox'
import { Edit, Bed } from 'lucide-react'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'

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

type WardDTO = {
  id: string,
  name: string,
  rooms: Room[],
  unscheduled: number,
  inProgress: number,
  done: number
}

export type WardCardProps = CardProps & {
  ward: WardDTO,
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
  const numberOfBeds = ward.rooms.map(value => value.bedCount).reduce((previousValue, currentValue) => currentValue + previousValue, 0)
  const hasRooms = ward.rooms.length > 0

  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group cursor-pointer')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <span className={tw('font-bold font-space')}>{ward.name}</span>
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
      <div className={tx('text-left my-1', { 'text-gray-400 text-sm': !hasRooms })}>
        {hasRooms ? ward.rooms.map(value => value.name).join(', ') : translation.noRoomsYet}
      </div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row')}>
          <Bed/>
          <div className={tw('pl-1')}>{numberOfBeds}</div>
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
