import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'

type StoryHeaderTranslation = {
  foundingStory: string,
  foundingStoryDescription: string,
}

const defaultStoryHeaderTranslation: Record<Languages, StoryHeaderTranslation> = {
  en: {
    foundingStory: 'Founding Story',
    foundingStoryDescription: 'In 2022, the founders of helpwave came together at a hackathon, driven by a shared passion to transform the digital health space. Inspired by our shared vision, we created helpwave - an innovative open source platform designed to revolutionize healthcare. Our first product, helpwave tasks, ushers in a new era of streamlined and accessible healthcare solutions.',
  },
  de: {
    foundingStory: 'Gründungsgeschichte',
    foundingStoryDescription: 'Im Jahr 2022 trafen sich die Gründer von helpwave bei einem Hackathon, angetrieben von der gemeinsamen Leidenschaft, das digitale Gesundheitswesen zu verändern. Inspiriert von unserer gemeinsamen Vision, schufen wir helpwave - eine innovative Open-Source-Plattform, die das Gesundheitswesen revolutionieren soll. Unser erstes Produkt, helpwave tasks, läutet eine neue Ära rationalisierter und zugänglicher Gesundheitslösungen ein.',
  }
}

const StoryHeader = ({ overwriteTranslation }: PropsForTranslation<StoryHeaderTranslation>) => {
  const translation = useTranslation(defaultStoryHeaderTranslation, overwriteTranslation)

  return (
    <SectionBase className={clsx('text-white')} backgroundColor="black">
      <div className={clsx('flex flex-col items-center desktop:!flex-row gap-x-16 gap-y-8 justify-between')}>
        <div className={clsx('flex flex-col gap-y-2')}>
          <span className={clsx('textstyle-title-xl')}>{translation.foundingStory}</span>
          <span>{translation.foundingStoryDescription}</span>
        </div>
        <Image src="https://cdn.helpwave.de/story/audience_award_mshack.png" alt="" width={0} height={0} className={clsx('w-full desktop:max-w-[60%]')}/>
      </div>
    </SectionBase>
  )
}

export default StoryHeader
