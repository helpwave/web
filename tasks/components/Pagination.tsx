import { tw, tx } from '@helpwave/common/twind/index'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { ChevronLast } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import { ChevronFirst } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

type PaginationTranslation = {
  of: string
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
  onPageChanged: (page: number) => void
}

export const Pagination = ({
  language,
  page,
  numberOfPages,
  onPageChanged
}: PropsWithLanguage<PaginationTranslation, PaginationProps>) => {
  const translation = useTranslation(language, defaultPaginationTranslations)

  const changePage = (page:number) => {
    onPageChanged(page)
  }

  const onFirstPage = page === 0
  const onLastPage = page === numberOfPages - 1

  return (
    <div className={tw('flex flex-row')}>
      <button onClick={() => changePage(0)} disabled={onFirstPage}>
        <ChevronFirst className={tx({ 'opacity-30': onFirstPage })}/>
      </button>
      <button onClick={() => changePage(page - 1)} disabled={onFirstPage}>
        <ChevronLeft className={tx({ 'opacity-30': onFirstPage })}/>
      </button>
      <div className={tw('flex min-w-[80px] justify-center mx-2')}>
        <span className={tw('select-none text-right flex-1')}>{page + 1}</span>
        <span className={tw('select-none mx-2')}>{translation.of}</span>
        <span className={tw('select-none text-left flex-1')}>{numberOfPages}</span>
      </div>
      <button onClick={() => changePage(page + 1)} disabled={onLastPage}>
        <ChevronRight className={tx({ 'opacity-30': onLastPage })}/>
      </button>
      <button onClick={() => changePage(numberOfPages - 1)} disabled={onLastPage}>
        <ChevronLast className={tx({ 'opacity-30': onLastPage })}/>
      </button>
    </div>
  )
}
