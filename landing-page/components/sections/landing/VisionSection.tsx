import clsx from 'clsx'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Chip } from '@helpwave/common/components/ChipList'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
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
      className={clsx('row mobile:col-reverse gap-8 items-center justify-center w-full')}
      outerClassName={clsx('py-24')}
      backgroundColor="white"
    >
      <div className={clsx('col w-1/2 mobile:w-full gap-y-2')}>
        <Chip className={clsx('!w-fit bg-gray-200 font-semibold px-4')}>{translation.ourVision}</Chip>
        <h2 className={clsx('textstyle-title-xl')}>{translation.title}</h2>
        <span className={clsx('font-inter font-semibold')}><MarkdownInterpreter text={translation.description}/></span>
      </div>
      <Image src={imageURL} alt="" width={0} height={0} className={clsx('mobile:w-full w-1/2')}/>
    </SectionBase>
  )
}

export default StartSection
