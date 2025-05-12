import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/components/icons/Tag'
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
      outerClassName="tablet:pb-0 desktop:pb-0"
      className="max-tablet:flex max-tablet:flex-wrap max-tablet:justify-center tablet:row tablet:justify-between w-full !gap-x-16 gap-y-8 items-center"

    >
      <div
        className="row items-end justify-center rounded-l-3xl max-tablet:w-full w-2/5 z-10 min-w-[250px]"
      >
        <Image
          src={imageUrl}
          alt=""
          width={371}
          height={649}
          className="max-h-[70vh]"
        />
      </div>
      <div className="col gap-y-2 pb-16 max-tablet:pb-0">
        <div className="col gap-y-2">
          <div className="row gap-x-1 text-primary items-center">
            <TagIcon/>
            <span className="textstyle-title-normal">{translation.patients}</span>
          </div>
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="font-space font-semibold"><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
    </SectionBase>
  )
}
