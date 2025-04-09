import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import type { ReactNode } from 'react'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuInformationTranslation = {
  title: string,
  subTitle1: string,
  subTitle2: string,
  subTitle3: ReactNode,
}

const defaultMediQuuInformationTranslation: Record<Languages, MediQuuInformationTranslation> = {
  en: {
    title: 'Information on the acquisition',
    subTitle1: 'helpwave, a young and innovative team, has developed process-oriented solutions for stationary care ' +
      'and is working on networking and cloud infrastructure solutions in healthcare. The merger with ' +
      'mediQuu will advance the connection between outpatient and inpatient care and provide innovative impulses for the ' +
      'product portfolio of mediQuu.',
    subTitle2: '\\b{So what does this mean for you specifically? Nothing.} \\newline' +
      'By transferring the contracts to helpwave, seamless continuation and further development of the existing ' +
      'solutions are ensured. The immediate involvement of healthcare system employees is paramount. We develop solutions ' +
      'in collaboration with doctors, rather than just working for them.',
    subTitle3: <>We would be delighted to meet you in person, simply send your suggested dates to <a
      className={clsx('underline')} href="mailto:mediquu@helpwave.de">mediquu@helpwave.de</a></>
  },
  de: {
    title: 'Informationen zur Transformation',
    subTitle1: 'helpwave, ein junges und innovatives Team, hat prozessorientierte Lösungen für die stationäre Versorgung ' +
      'entwickelt und arbeitet an Vernetzungs- und Cloud-Infrastrukturlösungen im Gesundheitswesen. Der Zusammenschluss mit ' +
      'mediQuu wird die Verknüpfung von ambulanter und stationärer Versorgung vorantreiben und innovative Impulse für das ' +
      'Produktportfolio von mediQuu liefern.',
    subTitle2: '\\b{Was bedeutet dies nun konkret für Sie? Nichts.} \\newline' +
      'Durch die Übertragung der Verträge an helpwave wird eine nahtlose Fortführung und Weiterentwicklung der bestehenden ' +
      'Lösungen gewährleistet. Die unmittelbare Einbindung der Mitarbeiterinnen und Mitarbeiter des Gesundheitssystems steht ' +
      'dabei an erster Stelle. Wir entwickeln Lösungen gemeinsam mit Ärztinnen und Ärzten, statt nur für sie zu arbeiten.',
    subTitle3: <>Wir würden uns über ein persönliches Kennenlernen sehr freuen, senden Sie Ihre Terminvorschläge ganz
      einfach an <a className={clsx('underline')} href="mailto:mediquu@helpwave.de">mediquu@helpwave.de</a></>
  }
}

export const MediQuuInformationSection = () => {
  const translation = useTranslation(defaultMediQuuInformationTranslation)
  return (
    <SectionBase className={clsx('flex desktop:flex-row mobile:flex-wrap gap-8 desktop:justify-between mobile:justify-center')} backgroundColor="white">
      <div className={clsx('max-w-[300px]')}>
        <Image src="https://cdn.helpwave.de/icons/agreement.svg" alt="two pages ready for signatures" width={400}
               height={150}/>
      </div>
      <div className={clsx('flex flex-col')}>
        <span className={clsx('textstyle-title-lg text-hw-secondary-400')}>{translation.title}</span>
        <span className={clsx('text-justify')}>{translation.subTitle1}</span>
        <br/>
        <span className={clsx('text-justify')}><MarkdownInterpreter text={translation.subTitle2}/></span>
        <br/>
        <span className={clsx('text-justify')}>{translation.subTitle3}</span>
      </div>
    </SectionBase>
  )
}
