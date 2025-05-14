import type { PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import Image from 'next/image'
import { Chip } from '@helpwave/hightide/components/ChipList'
import { MarkdownInterpreter } from '@helpwave/hightide/components/MarkdownInterpreter'
import { SectionBase } from '@/components/sections/SectionBase'

type VisionSectionTranslation = {
  ourVision: string,
  title: string,
  description: string,
}

const defaultVisionSectionTranslation: Record<Languages, VisionSectionTranslation> = {
  en: {
    ourVision: 'Our Vision',
    title: 'Support health care workers with data',
    description: 'We are developing innovative software that enables healthcare professionals to provide the best possible medical care to their patients.',
  },
  de: {
    ourVision: 'Unsere Vision',
    title: 'Datenbasierte Unterstützung im Gesundheitswesen',
    description: 'Wir entwickeln innovative Software, die es Fachleuten im Gesundheitswesen ermöglicht, ihren Patienten die bestmögliche medizinische Versorgung zu bieten.',
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<VisionSectionTranslation>) => {
  const translation = useTranslation(defaultVisionSectionTranslation, overwriteTranslation)
  const imageURL = 'https://cdn.helpwave.de/landing_page/process.png'
  return (
    <SectionBase
      className="flex max-tablet:flex-col-reverse tablet:row tablet:gap-x-8 gap-y-8 items-center justify-center w-full"
      outerClassName="py-24"
      backgroundColor="variant"
    >
      <div className="col w-1/2 max-tablet:w-full gap-y-2">
        <Chip color="blue" className="font-semibold px-4">{translation.ourVision}</Chip>
        <h2 className="textstyle-title-xl">{translation.title}</h2>
        <span className="font-inter font-semibold"><MarkdownInterpreter text={translation.description}/></span>
      </div>
      <Image src={imageURL} alt="" width={0} height={0} className="max-tablet:w-full max-tablet:max-w-[500px] w-1/2 py-4 px-8 rounded-2xl dark:bg-white"/>
    </SectionBase>
  )
}

export default StartSection
