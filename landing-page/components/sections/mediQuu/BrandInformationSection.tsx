import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Tile } from '@helpwave/common/components/layout/Tile'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuBrandDescriptionTranslation = {
  aboutMediQuuTitle: string,
  aboutHelpwaveTitle: string,
  aboutMediQuuDescription: string,
  aboutHelpwaveDescription: string
}

const defaultMediQuuBrandDescriptionTranslation: Record<Languages, MediQuuBrandDescriptionTranslation> = {
  en: {
    aboutMediQuuTitle: 'About mediQuu',
    aboutHelpwaveTitle: 'About helpwave',
    aboutMediQuuDescription: `
      Since 2015, we have been ensuring a comfortable and comprehensive networking of providers in the healthcare sector.
      Our goal is a demand-oriented development of digital services to simplify the networking of all actors
      and create new possibilities. In the future, we will pursue this path with the strong team of helpwave GmbH.
    `,
    aboutHelpwaveDescription: `
      As a dynamic technology company, helpwave is committed to the Open Innovation approach in healthcare, fostering new
      innovators to facilitate the easy and effective creation of high-quality health products with strong interoperability.
      With recent regulatory changes such as the introduction of the ePA and other directives impacting the outpatient sector,
      helpwave positions itself with a process-oriented development strategy as the leading alternative in the healthcare market,
      ensuring optimal digital healthcare delivery.
    `,
  },
  de: {
    aboutMediQuuTitle: 'Über mediQuu',
    aboutHelpwaveTitle: 'Über helpwave',
    aboutMediQuuDescription: `
      Seit 2015 sorgen wir für eine komfortable und übergreifende Vernetzung von Versorgern und Leistungserbringern im Gesundheitswesen.
      Unser Ziel ist stets eine bedarfsgerechte Entwicklung von digitalen Diensten, um die Vernetzung aller Aktuere zu vereinfachen
      und neue Möglichkeiten zu schaffen. Zukünftig werden wir diesen Weg mit dem starken Team der helpwave GmbH beschreiten.
    `,
    aboutHelpwaveDescription: `
      Als dynamisches Technologieunternehmen haben wir uns dem Open Innovation-Ansatz im Gesundheitswesen verschrieben.
      Durch die Förderung neuer Innovatoren ermöglichen wir die einfache und effektive Schöpfung hochwertiger Gesundheitsprodukte
      mit hoher Interoperabilität. Angesichts der jüngsten regulatorischen Veränderungen wie der Einführung der ePA und anderer Vorschriften
      mit Auswirkungen im ambulanten Bereich positioniert sich helpwave mit einer prozessorientierten Entwicklungsstrategie als
      führende Alternative im Gesundheitsmarkt, um eine optimale digitale Versorgung zu gewährleisten.
    `,
  }
}
export const BrandDescriptionsSection = () => {
  const translation = useTranslation(defaultMediQuuBrandDescriptionTranslation)
  return (
    <SectionBase className={tw('flex flex-col gap-8 justify-center')} backgroundColor="gray">
      <Tile
        title={{ value: translation.aboutMediQuuTitle, type: 'title' }}
        description={{ value: translation.aboutMediQuuDescription, type: 'normal' }}
        prefix={(
          <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={220} height={64} />
        )}
        className={tw('bg-white rounded-3xl px-6 mobile:py-6 tablet:py-12 desktop:py-16 !gap-6 !w-fit shadow-md mobile:flex-col tablet:flex-col')}
      />
      <Tile
        title={{ value: translation.aboutHelpwaveTitle, type: 'title' }}
        description={{ value: translation.aboutHelpwaveDescription, type: 'normal' }}
        prefix={(
          <div className={tw('min-w-[220px]')}>
            <HelpwaveBadge
              size="large"
              className="bg-hw-secondary-800 !gap-x-2 !w-fit"
            />
          </div>
        )}
        className={tw('text-white bg-hw-secondary-800 rounded-3xl px-6 mobile:py-6 tablet:py-12 desktop:py-16 !gap-6 !w-fit shadow-md mobile:flex-col tablet:flex-col')}
      />
    </SectionBase>
  )
}
