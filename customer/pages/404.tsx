import { Helpwave } from '@helpwave/hightide'
import type { NextPage } from 'next'
import Link from 'next/link'
import type { Translation } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import titleWrapper from '@/utils/titleWrapper'
import { Page } from '@/components/layout/Page'

type NotFoundTranslation = {
  notFound: string,
  notFoundDescription1: string,
  notFoundDescription2: string,
  homePage:string,
}

const defaultNotFoundTranslation: Translation<NotFoundTranslation> = {
  en: {
    notFound: '404 - Page not found',
    notFoundDescription1: 'This is definitely not the page you\'re looking for',
    notFoundDescription2: 'Let me take you to the',
    homePage: 'home page'
  },
  de: {
    notFound: '404 - Seite nicht gefunden',
    notFoundDescription1: 'Das ist definitiv nicht die Seite nach der Sie suchen',
    notFoundDescription2: 'Zurück zur',
    homePage: 'home page'
  }
}

const NotFound: NextPage = ({ overwriteTranslation }: PropsForTranslation<NotFoundTranslation>) => {
  const translation = useTranslation(defaultNotFoundTranslation, overwriteTranslation)
  return (
    <Page pageTitle={titleWrapper()} isHidingSidebar={true}>
      <div className="desktop:w-5/12 h-full desktop:mx-auto tablet:mx-16 max-tablet:mx-8 relative z-[1]">
        <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Helpwave className="w-full left-1/2 pt-[100px]" size={256} animate="bounce" />
          <h1 className="text-5xl font-space mb-8">{translation.notFound}</h1>
          <p className="text-3xl font-inter">{translation.notFoundDescription1}...</p>
          <p className="text-3xl font-inter">{translation.notFoundDescription2} <Link className="underline text-primary hover:brightness-75" href="/">{translation.homePage}</Link>.</p>
        </div>
      </div>
    </Page>
  )
}

export default NotFound
