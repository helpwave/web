import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Bed from '../../icons/Bed'
import { PillLabelBox } from '../pill/PillLabelBox'
import type { CardProps } from './Card'
import { Card } from './Card'

type WardCardTranslation = {
  edit: string
}

const defaultWardCardTranslations: Record<Languages, WardCardTranslation> = {
  en: {
    edit: 'Edit'
  },
  de: {
    edit: 'Bearbeiten'
  }
}

type WardDTO = {
  name: string,
  roomNames: string[],
  bedCount: number,
  unscheduled: number,
  inProgress: number,
  done: number
}

export type WardCardProps = CardProps & {
  ward: WardDTO,
  onEditClick?: () => void
}

export const WardCard = ({
  language,
  isSelected,
  ward,
  onTileClick = () => undefined,
  onEditClick = () => undefined
}: PropsWithLanguage<WardCardTranslation, WardCardProps>) => {
  const translation = useTranslation(language, defaultWardCardTranslations)
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('group cursor-pointer')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <span className={tw('font-bold font-space')}>{ward.name}</span>
        <button onClick={onEditClick}
                className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </div>
      <div className={tw('text-left my-1')}>{ward.roomNames.join(', ')}</div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row')}>
          <Bed/>
          <div className={tw('pl-1')}>{ward.bedCount}</div>
        </div>
        <PillLabelBox
          unscheduled={ward.unscheduled}
          inProgress={ward.inProgress}
          done={ward.done}/>
      </div>
    </Card>
  )
}
