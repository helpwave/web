import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import { FAQSection } from '@helpwave/common/components/layout/FAQSection'
import { SectionBase } from '@/components/sections/SectionBase'

type MediQuuFAQTranslation = {
  title: string,
  subTitle: string,
  faqs: { question: string, answer: string }[],
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
          \\b{There will be no changes to your contract or data protection terms.} Two emails will be sent to you in the next few days or may have already arrived in your mailbox. In one email, we will ask you to agree to the transfer of the contracts to helpwave under the existing conditions. The second email will ask you to confirm that helpwave is authorised to take over the mediQuu data under the existing data processing agreement. Please check your inbox and confirm the two emails by replying to them simply and informally. Here are two suggested wordings:
          \\b{For the transfer of contracts:}
          "Dear Sir or Madam, I hereby agree on behalf of practice XY to the transfer of my contracts to helpwave. I also agree to the terms and conditions and the privacy policy."
          \\b{For the transfer of data:}
          "Dear Sir or Madam, I hereby declare on behalf of practice XY my consent to the transfer of my personal data from mediQuu to helpwave within the scope of the existing data processing agreement."

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
          In den kommenden Tagen werden Ihnen zwei eMails zugesendet oder sind vielleicht sogar schon ins Postfach gekommen. In einer Mail bitten wir Sie um Ihre Zustimmung zur Übernahme der Verträge zu den bestehenden Konditionen and helpwave. In der zweiten Mail geht es um Ihre Bestätigung, dass helpwave die Daten der mediQuu im Rahmen der bestehenden Datenverarbeitungsvereinbarung übernehmen darf. Schauen Sie bitte in Ihr Postfach und bestätigen Sie die beiden Mails in dem Sie einfach und formlos darauf antworten. Hier wären zwei Formulierungsvorschläge:
          \\b{Zur Übernahme der Verträge:}
          "Sehr geehrte Damen und Herren, hiermit stimme Ich im Namen der Praxis XY der Übernahme meiner Verträge durch helpwave zu. Außerdem stimme ich den AGBs und der Datenschutzerklärung zu."
          \\b{Zur Übernahme der Daten:}
          "Sehr geehrte Damen und Herren, hiermit erkläre Ich im Namen der Praxis XY meine Einwilligung zur Übertragung meiner personenbezogenen Daten von mediQuu an helpwave im Rahmen der bereits an die mediQuu erteilten Auftragsverarbeitungsvereinbarung."
          Sie sehen also, hier handelt es sich um rein administrative Schritte, die wir Ihnen so einfach wie möglich machen wollen. Der Schutz Ihrer Daten und Ihr Komfort sind uns wichtig.
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
    <SectionBase  className={clsx('col w-full')}>
      <span className={clsx('textstyle-title-xl text-primary mb-1')}>{translation.title}</span>
      <span>{translation.subTitle}</span>
      <div className={clsx('col gap-y-4 mt-8')}>
        <FAQSection
          entries={translation.faqs.map((faq, index) => ({
            id: `faq${index}`,
            title: faq.question,
            content: {
              type: 'markdown',
              value: faq.answer
            }
          }))}
        />
      </div>
    </SectionBase>
  )
}
