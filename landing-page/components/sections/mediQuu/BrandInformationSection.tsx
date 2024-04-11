import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Tile } from '@helpwave/common/components/layout/Tile'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'

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
      Our goal is always a demand-oriented development of digital services to simplify the networking of all actors
      and create new possibilities. In the future, we will pursue this path with the strong team of helpwave GmbH.
    `,
    aboutHelpwaveDescription: `
      Regulatory burdens and high barriers to entry make it difficult for small companies to enter
      the market, leading to a lack of competition. helpwave is here to change that. We offer a platform that
      brings everyone to the table, not just the big companies.
    `,
  },
  de: {
    aboutMediQuuTitle: 'Über mediQuu',
    aboutHelpwaveTitle: 'Über helpwave',
    aboutMediQuuDescription: `
      Seit 2015 sorgen wir für eine komfortable und übergreifende Vernetzung von Versorg​ern und Leistungserbringern im Gesundheitswesen.
      Unser Ziel ist stets eine bedarfsgerechte Entwicklung von digitalen Diensten, um die Vernetzung aller Aktuere zu vereinfachen
      und neue Möglichkeiten zu schaffen. Zukünftig werden wir diesen Weg mit dem starken Team der helpwave GmbH beschreiten.
    `,
    aboutHelpwaveDescription: `
      Regulatorischer Aufwand und hohe Eintrittsbarrieren machen es kleinen Unternehmen schwer,
      in den Markt einzutreten, was zu einem Mangel an Wettbewerb führt. helpwave ist hier, um das zu ändern.
      Wir bieten eine Plattform, die alle an einen Tisch bringt, nicht nur die großen Unternehmen.
    `,
  }
}
export const BrandDescriptionsSection = () => {
  const translation = useTranslation(defaultMediQuuBrandDescriptionTranslation)
  return (
    <div className={tw('flex flex-col gap-8 justify-center w-full max-w-[1000px]')}>
      <Tile
        title={{ value: translation.aboutMediQuuTitle, type: 'title' }}
        description={{ value: translation.aboutMediQuuDescription, type: 'normal' }}
        prefix={(
          <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={220} height={64}/>
        )}
        className={tw('bg-white rounded-3xl px-6 mobile:py-6 desktop:py-16 !gap-6 !w-fit shadow-md !mobile:flex-col')}
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
        className={tw('text-white bg-hw-secondary-800 rounded-3xl px-6 mobile:py-6 desktop:py-16 !gap-6 !w-fit shadow-md !mobile:flex-col')}
      />
    </div>
  )
}
