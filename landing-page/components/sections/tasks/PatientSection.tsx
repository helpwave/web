import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { Tag } from 'lucide-react'
import { SectionBase } from '@/components/sections/SectionBase'

type PatientSectionTranslation = {
  title: string,
  description: string,
  patients: string
}

const defaultPatientSectionTranslation: Record<Languages, PatientSectionTranslation> = {
  en: {
    title: 'All that matters in one glance',
    description: 'Description Text Description Text Description Text Description Text Description Text Description Text.',
    patients: 'Patients'
  },
  de: {
    title: 'Alle Information auf nur einen Blick',
    description: 'Description Text Description Text Description Text Description Text Description Text Description Text.',
    patients: 'Patienten'
  }
}

export const PatientSection = ({ overwriteTranslation }: PropsForTranslation<PatientSectionTranslation>) => {
  const translation = useTranslation(defaultPatientSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/patient_list.png'

  return (
    <SectionBase
      className={tw('flex flex-row mobile:!flex-wrap w-full gap-x-32 gap-y-8 justify-between mobile:justify-center items-center')}
      backgroundColor="gray"
    >
      <div
        className={tw('flex flex-row bottom-0 justify-center rounded-l-3xl mobile:w-full w-2/5 z-10')}
      >
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className={tw('w-fit max-h-[70vh]')}
        />
      </div>
      <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <div className={tw('flex flex-row gap-x-1 text-hw-primary-400')}>
            <Tag size={24} strokeWidth={3}/>
            <Span className={tw('text-lg font-bold')}>{translation.patients}</Span>
          </div>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
        </div>
      </div>
    </SectionBase>
  )
}
