import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { Languages } from '@helpwave/hightide'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/hightide'
import { SectionBase } from '@/components/sections/SectionBase'
import { TasksPlaystoreBadge } from '@/components/TasksPlaystoreBadge'
import { TasksAppStoreBadge } from '@/components/TasksAppStoreBadge'

type MobileFeatureSectionTranslation = {
  title: string,
  description: string,
  tradmarkPlaystore: string,
  trademarkAppstore: string,
}

const defaultMobileFeatureSectionTranslation: Record<Languages, MobileFeatureSectionTranslation> = {
  en: {
    title: 'Seamless mobile experience',
    description: 'You don\'t have time to log in to a desk workspace to complete or assign tasks? Use the mobile app and never forget a task again.',
    tradmarkPlaystore: 'Google Play and the Google Play logo are trademarks of Google LLC.',
    trademarkAppstore: 'App Store℠ and the Apple logo® are trademarks of Apple Inc.'
  },
  de: {
    title: 'Nahtloses mobiles Erlebnis',
    description: 'Sie haben keine Zeit, sich an einem Schreibtisch anzumelden, um Aufgaben zu erledigen oder zuzuweisen? Verwenden Sie die mobile App und vergessen Sie nie wieder eine Aufgabe.',
    tradmarkPlaystore: 'Google Play und das Google Play-Logo sind Marken von Google LLC.',
    trademarkAppstore: 'App Store℠ und das Apple logo® sind Marken von Apple Inc.'
  }
}

export const MobileFeatureSection = ({ overwriteTranslation }: PropsForTranslation<MobileFeatureSectionTranslation>) => {
  const translation = useTranslation(defaultMobileFeatureSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/mobile_preview.png'

  return (
    <SectionBase
      className="max-tablet:flex max-tablet:flex-wrap-reverse justify-center tablet:row tablet:justify-between w-full gap-8"
      backgroundColor="secondary"
      outerClassName="!pb-0"
    >
      <div className="col gap-y-2 pb-16 desktop:w-3/5 justify-center">
        <div className="col gap-y-2 max-tablet:pb-0">
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="textstyle-title-normal"><MarkdownInterpreter text={translation.description}/></span>
        </div>
        <div
          // DO NOT CHANGE THE GAP. IT IS MANDATORY BY Apple
          className="flex flex-wrap gap-x-8 gap-y-4 mt-6"
        >
          <TasksPlaystoreBadge/>
          <TasksAppStoreBadge/>
        </div>
        <div className="col mt-6 gap-y-1">
          <span className="textstyle-description !text-xs">{translation.tradmarkPlaystore}</span>
          <span className="textstyle-description !text-xs">{translation.trademarkAppstore}</span>
        </div>
      </div>
      <div
        className="col items-center justify-end rounded-l-3xl w-2/5 max-tablet:w-full tablet:min-w-[220px] z-10 max-h-[70vh] min-h-[100%] desktop:min-h-[400px]"
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className="w-fit h-full max-h-[70vh] max-tablet:-translate-x-[6%]"
        />
      </div>
    </SectionBase>
  )
}
