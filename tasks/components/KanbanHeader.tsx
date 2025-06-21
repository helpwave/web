import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import { ChevronDown } from 'lucide-react'

type KanbanHeaderTranslation = {
  tasks: string,
  status: string,
  label: string,
  search: string,
}

const defaultKanbanHeaderTranslations: Translation<KanbanHeaderTranslation> = {
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
    <div className="row justify-between items-center">
      <span className="textstyle-table-name">{translation.tasks}</span>
      <div className="row gap-x-6">
        <div className="row gap-x-2 items-center hidden">
          {translation.status}
          <ChevronDown className="stroke-black"/>
        </div>
        <div className="row gap-x-2 items-center hidden">
          {translation.label}
          <ChevronDown className="stroke-black"/>
        </div>
        <Input id="search" value={searchValue} placeholder={translation.search} onChangeText={onSearchChange}/>
      </div>
    </div>
  )
}
