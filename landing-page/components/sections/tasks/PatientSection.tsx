import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type PatientSectionTranslation = {
  title: string,
  description: string,
  patients: string,
}

const defaultPatientSectionTranslation: Record<Languages, PatientSectionTranslation> = {
  en: {
    title: 'Ditch the printed patient list',
    description: 'Use the patient list to keep track of what’s going on in your ward and never have an outdated version again.',
    patients: 'Patients'
  },
  de: {
    title: 'Weg mit der gedruckten Patientenliste',
    description: 'Nutzen Sie die Patientenliste, um den Überblick über die Vorgänge auf Ihrer Station zu behalten und nie wieder eine veraltete Version zu benutzen.',
    patients: 'Patienten'
  }
}

export const PatientSection = ({ overwriteTranslation }: PropsForTranslation<PatientSectionTranslation>) => {
  const translation = useTranslation(defaultPatientSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/patient_list.png'

  return (
    <SectionBase
      outerClassName={tw('tablet:pb-0 desktop:pb-0')}
      className={tw('flex flex-row mobile:!flex-wrap w-full gap-x-16 gap-y-8 justify-between mobile:justify-center items-center')}
      backgroundColor="gray"
    >
      <div
        className={tw('flex flex-row items-end justify-center rounded-l-3xl mobile:w-full w-2/5 z-10 min-w-[250px]')}
      >
        <Image
          src={imageUrl}
          alt=""
          width={371}
          height={649}
          className={tw('max-h-[70vh]')}
        />
      </div>
      <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <div className={tw('flex flex-row gap-x-1 text-hw-primary-800 items-center')}>
            <TagIcon/>
            <Span className={tw('text-lg font-bold')}>{translation.patients}</Span>
          </div>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
        </div>
      </div>
    </SectionBase>
  )
}
