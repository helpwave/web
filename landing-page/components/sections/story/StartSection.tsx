import { tw } from '@helpwave/common/twind'
import { Popcorn } from 'lucide-react'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type StoryTranslation = {
  storyHeader: string,
  story: string,
  developmentOfTasks: string,
  marketEntryPlanning: string,
  headlineJourneyUnfolds: string,
  headlineDevelopmentOfTasks: string,
  headlineMarketEntryPlanning: string
}

const DefaultStoryTranslation = {
  en: {
    storyHeader: 'Our Story',
    story: 'helpwave emerged during the Münsterhack 2022, where it initially began as a first-aid app for citizens. Our team clinched the Viewers Choice award, and later, we received support through the Solution Enabler Program 2022. It was during this hackathon that the worlds of medicine and technology merged to form what we now know as helpwave.<br />' +
      'With a strong commitment to open-source software and active involvement from healthcare professionals, we introduced the first product, helpwave tasks, in February 2023. Around this time, helpwave also won the REACH Preincubator partnership, leading to the development of potential business cases and a thorough evaluation of helpwave tasks market viability.',
    developmentOfTasks: 'It became evident that helpwave\'s primary focus lay in data governance. This means that, before diving into advanced data science applications for healthcare, helpwave prioritized access, storage, and data management. This approach also extended to helpwave tasks, which initially assists in aggregating and processing event data from existing hospital processes.\n' +
      'Even when used as a simple productivity tool (a to-do app), helpwave tasks offers significant benefits to hospitals and their staff. It can save up to 3 hours per shift on documentation and collaboration planning, resulting in remarkable efficiency gains.\n' +
      'Thus, the idea of a to-do app for doctors and healthcare professionals evolved into an open-source product designed for both computers and mobile devices, specifically tailored for use in healthcare settings. Our development team maintains close collaboration with the Medical Team, acting as product owners. This approach ensures that the app consistently meets the high standards of its users throughout its development.',
    marketEntryPlanning: 'It became evident that helpwave&#38;s primary focus lay in data governance. This means that, before diving into advanced data science applications for healthcare, helpwave prioritized access, storage, and data management. ' +
      'This approach also extended to helpwave tasks, which initially assists in aggregating and processing event data from existing hospital processes.<br />' +
      'Even when used as a simple productivity tool (a to-do app), helpwave tasks offers significant benefits to hospitals and their staff. It can save up to 2 hours per shift on documentation and collaboration planning, resulting in remarkable efficiency gains.<br />\n' +
      'Thus, the idea of a to-do app for doctors and healthcare professionals evolved into an open-source product designed for both computers and mobile devices, specifically tailored for use in healthcare settings. Our development team maintains close collaboration with the Medical Team, acting as product owners. This approach ensures that the app consistently meets the high standards of its users throughout its development.',
    headlineJourneyUnfolds: '1. helpwave\'s Journey Unfolds',
    headlineDevelopmentOfTasks: '2. Development of tasks Takes Shape',
    headlineMarketEntryPlanning: '3. Market Entry Planning'
  },
  de: {
    storyHeader: 'Unsere Geschichte',
    story: 'helpwave entstand während des Münsterhack 2022, wo es zunächst als Erste-Hilfe-App für Bürger begann. Unser Team gewann den Viewers Choice Award und erhielt später Unterstützung durch das Solution Enabler Program 2022. Während dieses Hackathons verschmolzen die Welten der Medizin und Technologie zu dem, was wir heute als helpwave kennen.<br />' +
      'Mit einem starken Engagement für Open-Source-Software und aktiver Beteiligung von Gesundheitsfachleuten führten wir im Februar 2023 das erste Produkt, helpwave tasks, ein. Um diese Zeit gewann helpwave auch die REACH Preincubator-Partnerschaft, was zur Entwicklung potenzieller Geschäftsfälle und einer gründlichen Bewertung der Marktfähigkeit von helpwave tasks führte.',
    developmentOfTasks: 'Es wurde deutlich, dass der Hauptfokus von helpwave auf der Datenverwaltung lag. Dies bedeutet, dass helpwave vor dem Eintauchen in fortgeschrittene Datenwissenschaftsanwendungen für das Gesundheitswesen den Zugriff, die Speicherung und die Datenverwaltung priorisierte. Dieser Ansatz erstreckte sich auch auf helpwave tasks, die zunächst bei der Aggregation und Verarbeitung von Ereignisdaten aus bestehenden Krankenhausprozessen helfen.\n' +
      'Selbst wenn es als einfaches Produktivitätstool (eine To-Do-App) verwendet wird, bietet helpwave tasks erhebliche Vorteile für Krankenhäuser und ihr Personal. Es kann bis zu 3 Stunden pro Schicht bei der Dokumentation und der Planung der Zusammenarbeit sparen und so zu bemerkenswerten Effizienzgewinnen führen.\n' +
      'So entwickelte sich die Idee einer To-Do-App für Ärzte und Gesundheitsfachleute zu einem Open-Source-Produkt, das sowohl für Computer als auch für mobile Geräte konzipiert ist und speziell für den Einsatz in Gesundheitseinrichtungen entwickelt wurde. Unser Entwicklungsteam arbeitet eng mit dem medizinischen Team zusammen und fungiert als Produktbesitzer. Dieser Ansatz stellt sicher, dass die App während ihrer Entwicklung konsequent den hohen Standards ihrer Benutzer entspricht.',
    marketEntryPlanning: 'Es wurde deutlich, dass der Hauptfokus von helpwave auf der Datenverwaltung lag. Dies bedeutet, dass helpwave vor dem Eintauchen in fortgeschrittene Datenwissenschaftsanwendungen für das Gesundheitswesen den Zugriff, die Speicherung und die Datenverwaltung priorisierte. ' +
      'Dieser Ansatz erstreckte sich auch auf helpwave tasks, die zunächst bei der Aggregation und Verarbeitung von Ereignisdaten aus bestehenden Krankenhausprozessen helfen.<br />' +
      'Selbst wenn es als einfaches Produktivitätstool (eine To-Do-App) verwendet wird, bietet helpwave tasks erhebliche Vorteile für Krankenhäuser und ihr Personal. Es kann bis zu 2 Stunden pro Schicht bei der Dokumentation und der Planung der Zusammenarbeit sparen und so zu bemerkenswerten Effizienzgewinnen führen.<br />\n' +
      'So entwickelte sich die Idee einer To-Do-App für Ärzte und Gesundheitsfachleute zu einem Open-Source-Produkt, das sowohl für Computer als auch für mobile Geräte konzipiert ist und speziell für den Einsatz in Gesundheitseinrichtungen entwickelt wurde. Unser Entwicklungsteam arbeitet eng mit dem medizinischen Team zusammen und fungiert als Produktbesitzer. Dieser Ansatz stellt sicher, dass die App während ihrer Entwicklung konsequent den hohen Standards ihrer Benutzer entspricht.',
    headlineJourneyUnfolds: '1. Die Reise von helpwave geht weiter',
    headlineDevelopmentOfTasks: '2. Entwicklung von tasks nimmt Form an',
    headlineMarketEntryPlanning: '3. Planung des Markteintritts'
  }
}

const StartSection = ({ language }: PropsWithLanguage<StoryTranslation>) => {
  const translation = useTranslation(language, DefaultStoryTranslation)
  return (
    <div className={tw('pt-32')}>
      <div className={tw('ml-8 font-inter text-6xl font-light font-hw-error mobile:text-center')}>
        <Popcorn size="128" color="#A54F5C" className={tw('inline mobile:w-full mobile:mt-2 mr-16')}/>
        {translation.storyHeader}
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          {translation.headlineJourneyUnfolds}
        </h2>
        <p className={tw('mt-2')}>
          {translation.story}
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          {translation.headlineDevelopmentOfTasks}
        </h2>
        <p className={tw('mt-2')}>
          {translation.developmentOfTasks}
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          {translation.headlineMarketEntryPlanning}
        </h2>
        <p className={tw('mt-2')}>
          {translation.marketEntryPlanning}
        </p>
      </div>

    </div>
  )
}

export default StartSection
