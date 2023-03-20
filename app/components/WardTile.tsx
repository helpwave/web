import { tw, tx } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Bed from '../icons/Bed'
import { PillLabelBox } from './PillLabelBox'

type WardTileTranslation = {
  edit: string
}

const defaultWardTileTranslations: Record<Languages, WardTileTranslation> = {
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

export type WardTileProps = {
  ward: WardDTO,
  isSelected: boolean,
  onTileClicked?: () => void,
  onEditClicked?: () => void
}

export const WardTile = ({
  language,
  isSelected,
  ward,
  onTileClicked = () => undefined,
  onEditClicked = () => undefined
}: PropsWithLanguage<WardTileTranslation, WardTileProps>) => {
  const translation = useTranslation(language, defaultWardTileTranslations);
  return (
    <div onClick={onTileClicked}
         className={tx('group cursor-pointer rounded-md py-2 px-4 border border-2 hover:border-hw-primary-700 w-full', { 'border-hw-primary-700': isSelected })}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <span className={tw('font-bold font-space')}>{ward.name}</span>
        <button onClick={onEditClicked}
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
    </div>
  )
}
