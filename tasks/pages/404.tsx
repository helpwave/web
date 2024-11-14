import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import titleWrapper from '@/utils/titleWrapper'
import { PageWithHeader } from '@/components/layout/PageWithHeader'

type NotFoundTranslation = {
  notFound: string,
  notFoundDescription1: string,
  notFoundDescription2: string,
  homePage:string
}

const defaultNotFoundTranslation: Record<Languages, NotFoundTranslation> = {
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
    <PageWithHeader>
      <Head>
        <title>{titleWrapper()}</title>
      </Head>
      <div className={tw('desktop:w-5/12 h-full desktop:mx-auto tablet:mx-16 mobile:mx-8 relative z-[1]')}>
        <div className={tw('absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center')}>
          <Helpwave className={tw('w-full left-1/2 pt-[100px]')} size={256} animate="bounce" />
          <h1 className={tw('text-5xl font-space mb-8')}>{translation.notFound}</h1>
          <p className={tw('text-3xl font-inter')}>{translation.notFoundDescription1}...</p>
          <p className={tw('text-3xl font-inter')}>{translation.notFoundDescription2} <Link className={tw('underline text-hw-primary-600 hover:text-hw-primary-800')} href="/">{translation.homePage}</Link>.</p>
        </div>
      </div>
    </PageWithHeader>
  )
}

export default NotFound
