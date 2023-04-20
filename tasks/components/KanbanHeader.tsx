import { tw } from '@helpwave/common/twind/index'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import TriangleDown from '../icons/TriangleDown'
import { Input } from './user_input/Input'

type KanbanHeaderTranslation = {
  tasks: string,
  status: string,
  label: string,
  search: string
}

const defaultKanbanHeaderTranslations: Record<Languages, KanbanHeaderTranslation> = {
  en: {
    tasks: 'Tasks',
    status: 'Status',
    label: 'Label',
    search: 'Search'
  },
  de: {
    tasks: 'Aufgaben',
    status: 'Status',
    label: 'Label',
    search: 'Suchen'
  }
}

type KanbanHeaderProps = {
  sortingStatus?: string,
  sortingLabel?: string,
  searchValue: string,
  onSearchChange: (search: string) => void
}

export const KanbanHeader = ({
  language,
  searchValue = '',
  onSearchChange
}: PropsWithLanguage<KanbanHeaderTranslation, KanbanHeaderProps>) => {
  const translation = useTranslation(language, defaultKanbanHeaderTranslations)
  return (
    <div className={tw('flex flex-row justify-between items-center')}>
      <span className={tw('font-bold font-space text-lg')}>{translation.tasks}</span>
      <div className={tw('flex flex-row gap-x-6')}>
        <div className={tw('flex flex-row gap-x-2 items-center hidden')}>
          {translation.status}
          <TriangleDown className={tw('stroke-black')}/>
        </div>
        <div className={tw('flex flex-row gap-x-2 items-center hidden')}>
          {translation.label}
          <TriangleDown className={tw('stroke-black')}/>
        </div>
        <Input id="search" value={searchValue} label="" placeholder={translation.search} onChange={onSearchChange}/>
      </div>
    </div>
  )
}
