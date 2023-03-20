import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { FunctionComponent } from 'react'
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
  unscheduledTasks: number,
  inProgressTasks: number,
  doneTasks: number
}

export type WardTileProps = {
  ward: WardDTO,
  isSelected: boolean,
  tileClickedCallback?: () => void,
  editClickedCallback?: () => void
}

const WardTile: FunctionComponent<PropsWithLanguage<WardTileTranslation, WardTileProps>> = ({
  language,
  isSelected,
  ward,
  tileClickedCallback = () => undefined,
  editClickedCallback = () => undefined
}: PropsWithLanguage<WardTileTranslation, WardTileProps>) => {
  const translation = useTranslation(language, defaultWardTileTranslations)
  // TODO change border color for onHover and selected
  const selectedBorderColor = isSelected ? 'border-black' : ''
  return (
    <div onClick={tileClickedCallback}
         className={tw(`${selectedBorderColor} group cursor-pointer rounded-md py-2 px-4 border hover:border-black w-full`)}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <h5 className={tw('font-bold')}>{ward.name}</h5>
        <button onClick={editClickedCallback}
                className={tw('hidden group-hover:block')}>{translation.edit}</button>
      </div>
      <div className={tw('text-left my-1')}>{ward.roomNames.join(', ')}</div>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-row')}>
          <Bed/>
          <div className={tw('pl-1')}>{ward.bedCount}</div>
        </div>
        <PillLabelBox
          unscheduledCount={ward.unscheduledTasks}
          inProgressCount={ward.inProgressTasks}
          doneCount={ward.doneTasks}/>
      </div>
    </div>
  )
}

export { WardTile }
