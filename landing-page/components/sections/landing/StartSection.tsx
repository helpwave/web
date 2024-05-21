import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { SectionBase } from '@/components/sections/SectionBase'

type LandingPageTranslation = {
  title: string,
  description: string
}

const defaultLandingPageTranslation: Record<Languages, LandingPageTranslation> = {
  en: {
    title: 'helpwave - the Operating System for Hospitals',
    description: 'empowering medical heroes, united in technology'
  },
  de: {
    title: 'helpwave - das Betriebssystem für Krankenhäuser',
    description: 'Stärkung medizinischer Helden, vereint in Technologie'
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<LandingPageTranslation>) => {
  const translation = useTranslation(defaultLandingPageTranslation, overwriteTranslation)
  return (
    <SectionBase className={tw('flex flex-row mobile:!flex-wrap-reverse w-full !max-w-full gap-8 justify-between mobile:justify-end items-center !pr-0')}>
      <div className={tw('flex flex-col items-center flex-1 mobile:pr-6')}>
        <div className={tw('flex flex-col gap-y-2 max-w-[500px]')}>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
        </div>
      </div>
      <div className={tw('relative right-0 p-4 rounded-l-3xl bg-white w-2/5 tablet:min-w-[360px] mobile:w-4/5 z-10 h-fit shadow-xl')}>
        <Image
          // TODO replace image
          src="https://cdn.helpwave.de/screenshots/tasks_2.png"
          alt=""
          width={0}
          height={0}
          className={tw('w-full')}
        />
      </div>
    </SectionBase>
  )
}

export default StartSection
