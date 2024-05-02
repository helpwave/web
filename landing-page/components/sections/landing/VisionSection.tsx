import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Chip } from '@helpwave/common/components/ChipList'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { SectionBase } from '@/components/sections/SectionBase'

type VisionSectionTranslation = {
  ourVision: string,
  title: string,
  description: string
}

// TODO update translation
const defaultVisionSectionTranslation: Record<Languages, VisionSectionTranslation> = {
  en: {
    ourVision: 'Our Vision',
    title: 'Support health care workers with data',
    description: 'Description Text Description Text Description Text Description Text Description Text Description Text',
  },
  de: {
    ourVision: 'Unsere Vision',
    title: 'Entdecken unsere Vision',
    description: 'Description Text Description Text Description Text Description Text Description Text Description Text',
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<VisionSectionTranslation>) => {
  const translation = useTranslation(defaultVisionSectionTranslation, overwriteTranslation)
  const imageURL = 'https://cdn.helpwave.de/landing_page/process.png'
  return (
    <SectionBase className={tw('flex flex-row mobile:flex-col-reverse gap-8 items-center justify-center w-full')}>
      <div className={tw('flex flex-col w-1/2 mobile:w-full gap-y-2')}>
        <Chip className={tw('!w-fit bg-gray-200')}>{translation.ourVision}</Chip>
        <h2><Span type="title" className={tw('!text-3xl')}>{translation.title}</Span></h2>
        <Span className={tw('font-inter font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
      </div>
      <Image src={imageURL} alt="" width={0} height={0} className={tw('mobile:w-full w-1/2')}/>
    </SectionBase>
  )
}

export default StartSection
