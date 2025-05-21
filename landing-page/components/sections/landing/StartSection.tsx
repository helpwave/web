import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { Languages } from '@helpwave/hightide'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/hightide'
import { SectionBase } from '@/components/sections/SectionBase'

type LandingPageTranslation = {
  title: string,
  description: string,
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
      className="row max-tablet:!flex flex-wrap-reverse w-full !max-w-full gap-8 justify-between max-tablet:justify-center items-center"
      outerClassName="desktop:pr-0 tablet:pr-0 py-32"
    >
      <div className="col items-center flex-1">
        <div className="col gap-y-2 max-w-[600px]">
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="textstyle-title-lg"><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
      <div className="desktop:relative desktop:right-0 p-4 pr-0 max-tablet:pr-4 rounded-l-3xl max-tablet:rounded-3xl bg-white w-2/5 tablet:min-w-[360px] max-tablet:w-4/5 z-10 h-fit shadow-around-lg">
        <Image
          // TODO make attribution to https://www.freepik.com/free-vector/medics-working-charts_4950249.htm
          src="https://cdn.helpwave.de/landing_page/doctor_statistics.svg"
          alt=""
          width={0}
          height={0}
          className="w-full rounded-l-lg"
        />
      </div>
    </SectionBase>
  )
}

export default StartSection
