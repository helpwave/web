import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import Image from 'next/image'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Link from 'next/link'
import Header from '@/components/Header'
import { SectionBase } from '@/components/sections/SectionBase'
import Footer from '@/components/Footer'

type CreditsPageTranslation = {
  title: string,
  text: string
}

const defaultCreditsPageTranslation: Record<Languages, CreditsPageTranslation> = {
  en: {
    title: 'Credits',
    text: 'To credit our use of stock-footage from other websites, we are pleased to list them on this page.'
  },
  de: {
    title: 'Credits',
    text: 'Um die Verwendung von Stock-Footage von anderen Websites zu würdigen, führen wir sie gerne auf dieser Seite auf.'
  }
}

const freepikCredits: { text: string, link: string }[] = [
  {
    text: 'Image by katemangostar on Freepik',
    link: 'https://www.freepik.com/free-vector/medics-working-charts_4950249.htm'
  },
  {
    text: 'Image by pch.vector on Freepik',
    link: 'https://www.freepik.com/free-vector/expert-checking-business-leader-order_11235382.htm'
  }
]

const CreditsPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<CreditsPageTranslation>) => {
  const translation = useTranslation(defaultCreditsPageTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/landing_page/credits.jpg'

  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>

      <SectionBase
        className={tw('flex flex-row mobile:!flex-wrap-reverse w-full gap-x-16 gap-y-8 justify-between mobile:justify-center items-center')}
      >
        <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0')}>
          <div className={tw('flex flex-col gap-y-2')}>
            <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
            <Span className={tw('font-space font-semibold')}><MarkdownInterpreter
              text={translation.text}/></Span>
          </div>
        </div>
        <div
          className={tw('flex flex-row bottom-0 justify-center rounded-l-3xl mobile:w-full min-w-[50%] z-10')}
        >
          <Image
            src={imageUrl}
            alt=""
            width={0}
            height={0}
            className={tw('w-fit desktop:max-h-[70vh]')}
          />
        </div>
      </SectionBase>

      <SectionBase backgroundColor="gray">
        <h2><Span type="subsectionTitle">Freepik</Span></h2>
        <div className={tw('flex grow flex-col items-center min-w-50 items-center')}>
          {
            freepikCredits.map((credit) => (
              <div className={tw('mt-5 w-full')} key={credit.link}>
                <Span type="normal">{credit.text}</Span>
                <Link href={credit.link} className={tw('underline block')} target="_blank">{credit.link}</Link>
              </div>
            ))
          }
        </div>
      </SectionBase>
      <Footer/>
    </div>
  )
}

export default CreditsPage
