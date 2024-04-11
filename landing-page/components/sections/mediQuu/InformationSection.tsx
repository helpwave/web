import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@twind/core'
import { Span } from '@helpwave/common/components/Span'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import type { ReactNode } from 'react'

type MediQuuInformationTranslation = {
  title: string,
  subTitle1: string,
  subTitle2: string,
  subTitle3: ReactNode
}

const defaultMediQuuInformationTranslation: Record<Languages, MediQuuInformationTranslation> = {
  en: {
    title: 'Information on the acquisition',
    subTitle1: 'helpwave announces a strategic partnership with mediQuu to further strengthen its digital solutions' +
      ' in the outpatient sector. This alliance will allow mediQuu solutions to be further developed ' +
      'based on customer feedback.',
    subTitle2: '\\b{Nothing will change for mediQuu customers; products and services will continue as usual.} The transfer ' +
      'of contracts to helpwave will ensure the seamless continuation and further development of existing solutions. ' +
      'The partnership is committed to focusing on the needs of users and shaping the future of digital healthcare together.',
    subTitle3: <>We would be delighted to meet you in person, simply send your suggested dates to <a className={tw('underline')} href="mailto:mediquu@helpwave.de">mediquu@helpwave.de</a></>
  },
  de: {
    title: 'Informationen zur Übernahme',
    subTitle1: 'helpwave kündigt eine strategische Partnerschaft mit mediQuu an, um die digitalen Lösungen im' +
      ' ambulanten Sektor weiter zu stärken. Diese Allianz ermöglicht es, auf dem Feedback der Kunden aufbauend,' +
      ' die mediQuu-Lösungen weiterzuentwickeln.',
    subTitle2: '\\b{Für mediQuu-Kunden ändert sich nichts; Produkte und ' +
      'Dienstleistungen werden wie gewohnt fortgeführt.} Durch die Übertragung der Verträge zu helpwave wird eine ' +
      'nahtlose Fortführung und Weiterentwicklung der bestehenden Lösungen sichergestellt. Die Partnerschaft setzt' +
      'sich dafür ein, die Bedürfnisse der Nutzer in den Mittelpunkt zu stellen und gemeinsam die Zukunft der ' +
      'digitalen Gesundheitsversorgung zu gestalten.',
    subTitle3: <>Wir würden uns über ein persönliches Kennenlernen sehr freuen, senden Sie Ihre Terminvorschläge ganz einfach an <a className={tw('underline')} href="mailto:mediquu@helpwave.de">mediquu@helpwave.de</a></>
  }
}

export const MediQuuInformationSection = () => {
  const translation = useTranslation(defaultMediQuuInformationTranslation)
  return (
    <div
      className={tw('flex desktop:flex-row mobile:flex-wrap gap-8 desktop:justify-between mobile:justify-center w-full max-w-[1000px]')}>
      <div className={tw('max-w-[300px]')}>
        <Image src="https://cdn.helpwave.de/icons/agreement.svg" alt="two pages ready for signatures" width={400} height={150}/>
      </div>
      <div className={tw('flex flex-col')}>
        <Span type="heading" className={tw('text-hw-secondary-400')}>{translation.title}</Span>
        <Span className={tw('text-justify')}>{translation.subTitle1}</Span>
        <br/>
        <Span className={tw('text-justify')}><MarkdownInterpreter text={translation.subTitle2}/></Span>
        <br/>
        <Span className={tw('text-justify')}>{translation.subTitle3}</Span>
      </div>
    </div>
  )
}
