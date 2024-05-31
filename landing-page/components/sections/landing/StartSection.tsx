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
    description: 'empowering \\primary{medical heroes}, united in \\positive{technology}'
  },
  de: {
    title: 'helpwave - das Betriebssystem für Krankenhäuser',
    description: 'Stärkung \\primary{medizinischer Helden}, vereint in \\positive{Technologie}'
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<LandingPageTranslation>) => {
  const translation = useTranslation(defaultLandingPageTranslation, overwriteTranslation)
  return (
    <SectionBase
      className={tw('flex flex-row mobile:!flex-wrap-reverse w-full !max-w-full gap-8 justify-between mobile:justify-center items-center')}
      outerClassName={tw('desktop:pr-0 tablet:pr-0 py-32')}
    >
      <div className={tw('flex flex-col items-center flex-1')}>
        <div className={tw('flex flex-col gap-y-2 max-w-[600px]')}>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold !text-2xl')}><MarkdownInterpreter text={translation.description}/></Span>
        </div>
      </div>
      <div className={tw('desktop:relative desktop:right-0 p-4 pr-0 mobile:pr-4 rounded-l-3xl mobile:rounded-3xl bg-white w-2/5 tablet:min-w-[360px] mobile:w-4/5 z-10 h-fit shadow-around-lg')}>
        <Image
          // TODO make attribution to https://www.freepik.com/free-vector/medics-working-charts_4950249.htm
          src="https://cdn.helpwave.de/landing_page/doctor_statistics.svg"
          alt=""
          width={0}
          height={0}
          className={tw('w-full rounded-l-lg')}
        />
      </div>
    </SectionBase>
  )
}

export default StartSection
