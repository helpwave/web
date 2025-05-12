import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import type { Languages } from '../hooks/useLanguage'
import { useTranslation } from '../hooks/useTranslation'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { MultiSearchWithMapping } from '../util/simpleSearch'
import { Input } from './user-input/Input'

type SearchableListTranslation = {
  search: string,
  nothingFound: string,
}

const defaultSearchableListTranslation: Record<Languages, SearchableListTranslation> = {
  en: {
    search: 'Search',
    nothingFound: 'Nothing found'
  },
  de: {
    search: 'Suche',
    nothingFound: 'Nichts gefunden'
  }
}

export type SearchableListProps<T> = {
  list: T[],
  initialSearch?: string,
  searchMapping: (value: T) => string[],
  itemMapper: (value: T) => ReactNode,
  className?: string,
}

/**
 * A component for searching a list
 */
export const SearchableList = <T, >({
  overwriteTranslation,
  list,
  initialSearch = '',
  searchMapping,
  itemMapper,
  className
}: PropsForTranslation<SearchableListTranslation, SearchableListProps<T>>) => {
  const translation = useTranslation(defaultSearchableListTranslation, overwriteTranslation)
  const [search, setSearch] = useState<string>(initialSearch)

  useEffect(() => setSearch(initialSearch), [initialSearch])

  const filteredEntries = useMemo(() => MultiSearchWithMapping(search, list, searchMapping), [search, list, searchMapping])

  return (
    <div className={clsx('col gap-y-2', className)}>
      <div className="row justify-between gap-x-2 items-center">
        <div className="flex-1">
          <Input value={search} onChange={setSearch} placeholder={translation.search}/>
        </div>
        <Search size={20}/>
      </div>
      {filteredEntries.length > 0 && (
        <div className="col gap-y-1">
          {filteredEntries.map(itemMapper)}
        </div>
      )}
      {!filteredEntries.length && <div className="row justify-center">{translation.nothingFound}</div>}
    </div>
  )
}
