import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { SectionBase } from '@/components/sections/SectionBase'
import { TasksPlaystoreBadge } from '@/components/TasksPlaystoreBadge'
import { TasksAppStoreBadge } from '@/components/TasksAppStoreBadge'

type MobileFeatureSectionTranslation = {
  title: string,
  description: string,
  tradmarkPlaystore: string,
  trademarkAppstore: string
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
      className={tw('flex flex-row mobile:!flex-wrap-reverse w-full gap-8 justify-between mobile:justify-center text-white')}
      backgroundColor="darkSecondary"
      outerClassName={tw('!pb-0')}
    >
      <div className={tw('flex flex-col gap-y-2 pb-16 desktop:w-3/5 justify-center')}>
        <div className={tw('flex flex-col gap-y-2 mobile:pb-0')}>
          <h1 className={tw('textstyle-title-2xl')}>{translation.title}</h1>
          <span className={tw('textstyle-title-normal')}><MarkdownInterpreter text={translation.description}/></span>
        </div>
        <div
          // DO NOT CHANGE THE GAP. IT IS MANDATORY BY Apple
          className={tw('flex flex-wrap gap-x-8 gap-y-4 mt-6')}
        >
          <TasksPlaystoreBadge/>
          <TasksAppStoreBadge/>
        </div>
        <div className={tw('flex flex-col mt-6 gap-y-1')}>
          <span className={tw('textstyle-description !text-xs')}>{translation.tradmarkPlaystore}</span>
          <span className={tw('textstyle-description !text-xs')}>{translation.trademarkAppstore}</span>
        </div>
      </div>
      <div
        className={tw('flex flex-col items-center justify-end rounded-l-3xl w-2/5 mobile:w-full tablet:min-w-[220px] z-10 max-h-[70vh] min-h-[100%] desktop:min-h-[400px]')}
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className={tw('w-fit h-full max-h-[70vh] mobile:-translate-x-[6%]')}
        />
      </div>
    </SectionBase>
  )
}
