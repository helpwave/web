import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { FAQSection } from '@helpwave/common/components/layout/FAQSection'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuFAQTranslation = {
  title: string,
  subTitle: string,
  faqs: { question: string, answer: string }[]
}

const defaultMediQuuFAQTranslation: Record<Languages, MediQuuFAQTranslation> = {
  en: {
    title: 'FAQ',
    subTitle: 'We are available to answer any questions you may have at short notice.',
    faqs: [
      {
        question: 'I just want to continue using mediQuu products, what do I need to do?',
        answer: `
          We're glad to hear that! We'll make the transition as easy as possible for you.
          \\b{There will be no changes to your contract or data protection terms.} In the coming weeks,
          we will personally provide you with further information on the administrative details.
          Protecting your data and ensuring your convenience are our top priorities.
        `
      },
      {
        question: `Why is helpwave taking over mediQuu's products?`,
        answer: `
          The existing products of mediQuu will continue to be supported seamlessly.
          However, to expand and complement the development of this product range according to your requirements,
          \\b{a large and innovative development team is necessary}. Software products in the healthcare sector
          and their users have the highest demands for quality. Our goal is to meet these demands.
          helpwave has already successfully developed software in the field of inpatient care and now aims to enter
          the outpatient sector through the merger with mediQuu.
        `
      },
      {
        question: 'Will the prices for my products change now?',
        answer: `
          \\b{No}. Prices for existing contracts will not change for existing customers.
          New developments may result in new pricing models, which will be clearly identifiable,
          with additional functionalities and without restricting existing functions.
          Transparency is one of the core ideologies of the open-source company helpwave.
        `
      }
    ]
  },
  de: {
    title: 'Häufige Fragen',
    subTitle: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
    faqs: [
      {
        question: 'Ich will einfach nur die mediQuu Produkte weiter nutzen, was muss ich tun?',
        answer: `
          Das freut uns! Wir machen Ihnen den Übergang so einfach wie möglich.
          \\b{An Ihrem Vertrag und Ihren Datenschutzbedingungen ändert sich überhaupt nichts.}
          In den kommenden Wochen werden wir Ihnen persönlich weitere Informationen zu den administrativen
          Details zukommen lassen. Der Schutz Ihrer Daten und Ihr Komfort stehen dabei an erster Stelle.
        `
      },
      {
        question: 'Warum übernimmt helpwave die Produkte der mediQuu?',
        answer: `
          Die bestehenden Produkte der mediQuu werden nahtlos weiter unterstützt.
          Um die Entwicklung dieser Produktpalette jedoch nach Ihren Vorstellungen zu erweitern und zu ergänzen,
          ist \\b{ein großes und innovatives Entwicklungsteam notwendig}. Softwareprodukte im Gesundheitssektor
          und Ihre Anwender haben höchste Ansprüche an Qualität. Diesen Ansprüchen gerecht zu werden ist unser Ziel.
          helpwave hat bereits erfolgreich Software im Bereich der stationären Versorgung entwickelt und will
          nun mit der Vereinigung mit der mediQuu den Sprung in den ambulanten Sektor wagen.
        `
      },
      {
        question: 'Ändern sich jetzt die Preise für meine Produkte?',
        answer: `
          \\b{Nein}. Für Bestandskunden werden sich keine Preise für bereits abgeschlossene Verträge ändern.
          Möglich sind neue Entwicklungen die dann in neuen Preismodellen angeboten werden können, dann aber klar erkennbar,
          mit zusätzlichen Funktionalitäten und ohne Einschränkung der bestehenden Funktionen. Transparenz ist eine
          der Kernideologien des Open Source Unternehmens helpwave.
        `
      }
    ]
  }
}

export const MediQuuFAQSection = () => {
  const translation = useTranslation(defaultMediQuuFAQTranslation)
  return (
    <SectionBase backgroundColor="gray" className={tw('flex flex-col w-full')}>
      <Span type="title" className={tw('text-hw-secondary-400 !text-3xl mb-1')}>{translation.title}</Span>
      <Span>{translation.subTitle}</Span>
      <div className={tw('flex flex-col gap-y-4 mt-8')}>
        <FAQSection
          entries={translation.faqs.map((faq, index) => ({
            id: `faq${index}`,
            title: faq.question,
            content: {
              type: 'markdown',
              value: faq.answer
            }
          }))}
          expandableClassName={tw('!py-4 !px-6')}
        />
      </div>
    </SectionBase>
  )
}
