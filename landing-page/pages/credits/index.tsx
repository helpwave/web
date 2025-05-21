import type { NextPage } from 'next'
import { MarkdownInterpreter } from '@helpwave/hightide'
import Image from 'next/image'
import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import Link from 'next/link'
import { SectionBase } from '@/components/sections/SectionBase'
import { Page } from '@/components/Page'

type CreditsPageTranslation = {
  title: string,
  text: string,
  flaticon: string,
  createdBy: (name: string, author: string) => string,
}

const defaultCreditsPageTranslation: Record<Languages, CreditsPageTranslation> = {
  en: {
    title: 'Credits',
    text: 'To credit our use of stock-footage from other websites, we are pleased to list them on this page.',
    flaticon: 'Icons by Flaticon',
    createdBy: (name, author) => `${name} created by ${author}`
  },
  de: {
    title: 'Credits',
    text: 'Um die Verwendung von Stock-Footage von anderen Websites zu würdigen, führen wir sie gerne auf dieser Seite auf.',
    flaticon: 'Icons von Flaticon',
    createdBy: (name, author) => `${name} erstellt von ${author}`
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
  },
  {
    text: 'Image by freepik on Freepik',
    link: 'https://www.freepik.com/free-photo/doctors-looking-laptop-while-sitting_5480800.htm'
  },
  {
    text: 'Image by wirestock on Freepik',
    link: 'https://www.freepik.com/free-photo/wide-shot-huge-tree-trunk-near-lake-surrounded-by-trees-blue-sky_7841618.htm'
  },
  {
    text: 'Image by freepik on Freepik',
    link: 'https://www.freepik.com/free-vector/infographic-dashboard-element-set_6209714.htm'
  },
  {
    text: 'Image by Those Icons on Freepik',
    link: 'https://www.freepik.com/icon/donut-chart_483638'
  }
]

const flaticonCredits: { author: string, link: string, name: string }[] = [
  {
    name: 'label',
    author: 'Creatype',
    link: 'https://www.flaticon.com/free-icon/price-tag_721550?term=label&page=1&position=8&origin=tag&related_id=721550'
  },
  {
    name: 'hospital',
    author: 'Freepik',
    link: 'https://www.flaticon.com/free-icon/hospital_3809392?term=hospital&page=1&position=8&origin=search&related_id=3809392'
  },
  {
    name: 'doctors',
    author: 'Slidicon',
    link: 'https://www.flaticon.com/free-icon/doctors_3017241?term=doctors&page=1&position=14&origin=search&related_id=3017241'
  },
]

const CreditsPage: NextPage = ({ overwriteTranslation }: PropsForTranslation<CreditsPageTranslation>) => {
  const translation = useTranslation(defaultCreditsPageTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/landing_page/credits.jpg'

  return (
    <Page pageTitleAddition={translation.title}>
      <SectionBase
        className="row max-tablet:!flex flex-wrap-reverse w-full gap-x-16 gap-y-8 justify-between max-tablet:justify-center items-center"
        backgroundColor="variant"
      >
        <div className="col gap-y-2 pb-16 max-tablet:pb-0">
          <div className="col gap-y-2">
            <h1 className="textstyle-title-2xl">{translation.title}</h1>
            <span className="font-space font-semibold"><MarkdownInterpreter
              text={translation.text}/></span>
          </div>
        </div>
        <div
          className="row bottom-0 justify-center rounded-l-3xl max-tablet:w-full min-w-[50%] z-10"
        >
          <Image
            src={imageUrl}
            alt=""
            width={0}
            height={0}
            className="w-fit desktop:max-h-[70vh]"
          />
        </div>
      </SectionBase>

      <SectionBase  className="w-full">
        <h2 className="textstyle-title-normal">Freepik</h2>
        <div className="grow col items-center min-w-50 items-center gap-y-4">
          {
            freepikCredits.map((credit) => (
              <div className="w-full" key={credit.link}>
                <span>{credit.text}</span>
                <Link href={credit.link} className="underline block" target="_blank">{credit.link}</Link>
              </div>
            ))
          }
        </div>

      </SectionBase>

      <SectionBase backgroundColor="variant" className="col gap-y-2 w-full">
        <h2 className="textstyle-title-md">{translation.flaticon}</h2>
        {flaticonCredits.map(({ name, author, link }) => (
          <Link key={name + author} href={link} title={name} className="underline" target="_blank">
            {translation.createdBy(name, author)}
          </Link>
        ))}
      </SectionBase>
    </Page>
  )
}

export default CreditsPage
