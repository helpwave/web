import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import { ColumnTitle } from '@/components/ColumnTitle'

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
  const translation = useTranslation([defaultKanbanHeaderTranslations], overwriteTranslation)
  return (
    <ColumnTitle
      title={translation('tasks')}
      actions={(
        <Input
          value={searchValue}
          placeholder={translation('search')}
          onChangeText={onSearchChange}
          containerClassName="!w-auto"
        />
      )}
    />
  )
}
