import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import Scrollbars from 'react-custom-scrollbars-2'
import { TextImage } from '@helpwave/common/components/TextImage'
import { SectionBase } from '@/components/sections/SectionBase'

type StepsToDigitalizationSectionTranslation = {
  title: string,
  description: string,
  step: string,
  step1Title: string,
  step1Description: string,
  step2Title: string,
  step2Description: string,
  step3Title: string,
  step3Description: string
}

const defaultStepsToDigitalizationSectionTranslation: Record<Languages, StepsToDigitalizationSectionTranslation> = {
  en: {
    // TODO update
    title: '\\secondary{Digital exelence} in\\newline 3 simple steps',
    description: 'Our approach is to implement more efficient and fun\\newline processes in a simple yet powerful way.',
    step: 'Step',
    step1Title: 'Digitalization of organization and coordination',
    step1Description: 'At helpwave, we don\'t just develop software for the healthcare sector',
    step2Title: 'Feeding and preparation of data',
    step2Description: 'At helpwave, we don\'t just develop software for the healthcare sector',
    step3Title: 'Qualitätskontrolle, Business Insights und Process Mining',
    step3Description: 'At helpwave, we don\'t just develop software for the healthcare sector'
  },
  de: {
    // TODO update
    title: '\\secondary{Digitale Exelenz} in\\newline 3 Schritten',
    description: 'Unser Ansatz ist es, effizientere Prozesse zu implementieren, die Spaß machen\\newline - und das auf einfache, aber wirkungsvolle Weise.',
    step: 'Step',
    step1Title: 'Digitalisierung der Organisation und Koordination',
    step1Description: 'Bei helpwave entwickeln wir nicht einfach nur Software für das Gesundheitswesen',
    step2Title: 'Einspeisung und Aufbereitung von Daten',
    step2Description: 'Bei helpwave entwickeln wir nicht einfach nur Software für das Gesundheitswesen',
    step3Title: 'Qualitätskontrolle, Business Insights und Process Mining',
    step3Description: 'Bei helpwave entwickeln wir nicht einfach nur Software für das Gesundheitswesen'
  }
}

/**
 * A Section for showing steps need for Digitalization
 */
export const StepsToDigitalizationSection = () => {
  const translation = useTranslation(defaultStepsToDigitalizationSectionTranslation)

  const maxHeight = 300
  const className = tw(`!w-[500px] !h-[${maxHeight}px]`)

  return (
    <SectionBase className={tw('flex flex-col gap-y-8 !max-w-full')}>
      <div className={tw('flex flex-col items-center text-center gap-y-2')}>
        <h2><Span type="title" className={tw('!text-3xl')}><MarkdownInterpreter text={translation.title}/></Span></h2>
        <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
      </div>
      <div className={tw('w-full')}>
        <Scrollbars autoHeight={true} autoHeightMax={maxHeight} universal={true}>
          <div className={tw('flex flex-row gap-x-16 items-center')}>
            <TextImage
              badge={`${translation.step} #1`}
              title={translation.step1Title}
              description={translation.step1Description}
              imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
              color="primary"
              contentClassName={className}
              className={className}
            />
            <TextImage
              badge={`${translation.step} #2`}
              title={translation.step2Title}
              description={translation.step2Description}
              imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
              color="secondary"
              contentClassName={className}
              className={className}
            />
            <TextImage
              badge={`${translation.step} #3`}
              title={translation.step3Title}
              description={translation.step3Description}
              imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
              color="secondaryDark"
              contentClassName={className}
              className={className}
            />
          </div>
        </Scrollbars>
      </div>
    </SectionBase>
  )
}
