import type { Languages } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Tile } from '@helpwave/hightide'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/hightide'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuBrandDescriptionTranslation = {
  aboutMediQuuTitle: string,
  aboutHelpwaveTitle: string,
  aboutMediQuuDescription: string,
  aboutHelpwaveDescription: string,
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
    <SectionBase className="col gap-8 justify-center" >
      <Tile
        title={{ value: translation.aboutMediQuuTitle, className: 'textstyle-title-lg' }}
        description={{ value: translation.aboutMediQuuDescription, className: '' }}
        prefix={(
          <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={220} height={64} className="p-4 rounded-lg dark:bg-white"/>
        )}
        className="bg-surface text-on-surface rounded-3xl px-6 max-tablet:py-6 tablet:py-12 desktop:py-16 !gap-6 !w-fit shadow-md max-tablet:col tablet:col"
      />
      <Tile
        title={{ value: translation.aboutHelpwaveTitle, className: 'textstyle-title-lg' }}
        description={{ value: translation.aboutHelpwaveDescription, className: '' }}
        prefix={(
          <div className="min-w-[220px]">
            <HelpwaveBadge
              size="large"
              className="bg-secondary !gap-x-2 !w-fit"
            />
          </div>
        )}
        className="text-on-secondary bg-secondary rounded-3xl px-6 max-tablet:py-6 tablet:py-12 desktop:py-16 !gap-6 !w-fit shadow-md max-tablet:col tablet:col"
      />
    </SectionBase>
  )
}
