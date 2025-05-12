import { Helpwave } from '@helpwave/common/components/icons/Helpwave'
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
  toHomePage: (link: ReactNode) => ReactNode,
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
    <Page className="h-screen" pageTitleAddition={translation.notFound}>
      <SectionBase className="col h-full items-center justify-center text-center" outerClassName="h-full">
        <Helpwave className="w-full left-1/2" size={256} animate="bounce"/>
        <h1 className="text-9xl max-tablet:text-6xl font-space mb-8">{`404 ${translation.notFound}`}</h1>
        <p className="text-4xl max-tablet:text-xl font-inter">{translation.description}</p>
        <p className="text-4xl max-tablet:text-xl font-inter">
          {translation.toHomePage(<Link className="underline text-cyan-900" href="/">home page</Link>)}
        </p>
      </SectionBase>
    </Page>
  )
}

export default NotFound
