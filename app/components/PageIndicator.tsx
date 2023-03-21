import { tw, tx } from '@helpwave/common/twind/index'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import ChevronLast from '../icons/ChevronLast'
import ChevronLeft from '../icons/ChevronLeft'
import ChevronFirst from '../icons/ChevronFirst'
import { useState } from 'react'
import ChevronRight from '../icons/ChevronRight'

type PageIndicatorTranslation = {
  of: string
}
const defaultOrganizationMemberListTranslations: Record<Languages, PageIndicatorTranslation> = {
  en: {
    of: 'of'
  },
  de: {
    of: 'von'
  }
}

export type PageIndicatorProps = {
  initialPage: number, // starts with 0
  numberOfPages: number,
  onPageChanged: (page: number) => void
}

export const PageIndicator = ({
  language,
  initialPage,
  numberOfPages,
  onPageChanged
}: PropsWithLanguage<PageIndicatorTranslation, PageIndicatorProps>) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const translation = useTranslation(language, defaultOrganizationMemberListTranslations)

  const changePage = (page:number) => {
    setCurrentPage(page)
    onPageChanged(page)
  }

  const onFirstPage = currentPage === 0
  const onLastPage = currentPage === numberOfPages - 1
  return (
    <div className={tw('flex flex-row')}>
      <button onClick={() => changePage(0)} disabled={onFirstPage}>
        <ChevronFirst className={tx({ 'opacity-30': onFirstPage })}/>
      </button>
      <button onClick={() => changePage(currentPage - 1)} disabled={onFirstPage}>
        <ChevronLeft className={tx({ 'opacity-30': onFirstPage })}/>
      </button>
      <div className={tw('flex min-w-[80px] justify-center mx-2')}>
        <span className={tw('select-none text-right flex-1')}>{currentPage + 1}</span>
        <span className={tw('select-none mx-2')}>{translation.of}</span>
        <span className={tw('select-none text-left flex-1')}>{numberOfPages}</span>
      </div>
      <button onClick={() => changePage(currentPage + 1)} disabled={onLastPage}>
        <ChevronRight className={tx({ 'opacity-30': onLastPage })}/>
      </button>
      <button onClick={() => changePage(numberOfPages - 1)} disabled={onLastPage}>
        <ChevronLast className={tx({ 'opacity-30': onLastPage })}/>
      </button>
    </div>
  )
}
