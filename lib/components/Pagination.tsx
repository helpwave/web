import { ChevronLast, ChevronLeft, ChevronFirst, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import type { Languages } from '../hooks/useLanguage'

type PaginationTranslation = {
  of: string,
}
const defaultPaginationTranslations: Record<Languages, PaginationTranslation> = {
  en: {
    of: 'of'
  },
  de: {
    of: 'von'
  }
}

export type PaginationProps = {
  page: number, // starts with 0
  numberOfPages: number,
  onPageChanged: (page: number) => void,
}

/**
 * A Component showing the pagination allowing first, before, next and last page navigation
 */
export const Pagination = ({
  overwriteTranslation,
  page,
  numberOfPages,
  onPageChanged
}: PropsForTranslation<PaginationTranslation, PaginationProps>) => {
  const translation = useTranslation(defaultPaginationTranslations, overwriteTranslation)

  const changePage = (page:number) => {
    onPageChanged(page)
  }

  const noPages = numberOfPages === 0
  const onFirstPage = page === 0 && !noPages
  const onLastPage = page === numberOfPages - 1

  return (
    <div className={clsx('row', { 'opacity-30': noPages })}>
      <button onClick={() => changePage(0)} disabled={onFirstPage}>
        <ChevronFirst className={clsx({ 'opacity-30': onFirstPage })}/>
      </button>
      <button onClick={() => changePage(page - 1)} disabled={onFirstPage}>
        <ChevronLeft className={clsx({ 'opacity-30': onFirstPage })}/>
      </button>
      <div className="min-w-[80px] justify-center mx-2">
        <span className="select-none text-right flex-1">{noPages ? 0 : page + 1}</span>
        <span className="select-none mx-2">{translation.of}</span>
        <span className="select-none text-left flex-1">{numberOfPages}</span>
      </div>
      <button onClick={() => changePage(page + 1)} disabled={onLastPage || noPages}>
        <ChevronRight className={clsx({ 'opacity-30': onLastPage })}/>
      </button>
      <button onClick={() => changePage(numberOfPages - 1)} disabled={onLastPage || noPages}>
        <ChevronLast className={clsx({ 'opacity-30': onLastPage })}/>
      </button>
    </div>
  )
}
