import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { SectionBase } from '@/components/sections/SectionBase'
import { Page } from '@/components/Page'

type NotFoundTranslation = {
  notFound: string,
  description: string,
  toHomePage: (link: ReactNode) => ReactNode
}

const defaultNotFoundTranslation: Record<Languages, NotFoundTranslation> = {
  en: {
    notFound: 'Not Found',
    description: 'This is definitely not the site you&\'re looking for.',
    toHomePage: link => (
      <>
        Let me take you to the {link}.
      </>
    )
  },
  de: {
    notFound: 'Nicht Gefunden',
    description: 'Das ist definitv nicht die Seite nach der Ihr gesucht habt.',
    toHomePage: link => (
      <>
        Lass mich dich zur {link} zurückbringen.
      </>
    )
  }
}

const NotFound: NextPage = () => {
  const translation = useTranslation(defaultNotFoundTranslation)
  return (
    <Page className={tw('h-screen')} pageTitleAddition={translation.notFound}>
      <SectionBase className={tw('flex flex-col h-full items-center justify-center text-center')} outerClassName={tw('h-full')}>
        <Helpwave className={tw('w-full left-1/2')} size={256} animate="bounce"/>
        <h1 className={tw('text-9xl mobile:text-6xl font-space mb-8')}>{`404 ${translation.notFound}`}</h1>
        <p className={tw('text-4xl mobile:text-xl font-inter')}>{translation.description}</p>
        <p className={tw('text-4xl mobile:text-xl font-inter')}>
          {translation.toHomePage(<Link className={tw('underline text-cyan-900')} href="/">home page</Link>)}
        </p>
      </SectionBase>
    </Page>
  )
}

export default NotFound
