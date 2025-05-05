import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Input } from '@helpwave/common/components/user-input/Input'
import { ChevronDown } from 'lucide-react'

type KanbanHeaderTranslation = {
  tasks: string,
  status: string,
  label: string,
  search: string,
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
  onSearchChange: (search: string) => void,
}

/**
 * The header of the KanbanBoard affording a search
 */
export const KanbanHeader = ({
  overwriteTranslation,
  searchValue = '',
  onSearchChange
}: PropsForTranslation<KanbanHeaderTranslation, KanbanHeaderProps>) => {
  const translation = useTranslation(defaultKanbanHeaderTranslations, overwriteTranslation)
  return (
    <div className={clsx('row justify-between items-center')}>
      <span className={clsx('textstyle-table-name')}>{translation.tasks}</span>
      <div className={clsx('row gap-x-6')}>
        <div className={clsx('row gap-x-2 items-center hidden')}>
          {translation.status}
          <ChevronDown className={clsx('stroke-black')}/>
        </div>
        <div className={clsx('row gap-x-2 items-center hidden')}>
          {translation.label}
          <ChevronDown className={clsx('stroke-black')}/>
        </div>
        <Input id="search" value={searchValue} placeholder={translation.search} onChange={onSearchChange}/>
      </div>
    </div>
  )
}
