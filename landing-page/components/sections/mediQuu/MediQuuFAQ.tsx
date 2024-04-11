import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { FAQSection } from '@helpwave/common/components/layout/FAQSection'

type MediQuuFAQTranslation = {
  title: string,
  subTitle: string
}

const defaultMediQuuFAQTranslation: Record<Languages, MediQuuFAQTranslation> = {
  en: {
    title: 'FAQ',
    subTitle: 'We are available to answer any questions you may have at short notice.',
  },
  de: {
    title: 'Häufige Fragen',
    subTitle: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
  }
}

export const MediQuuFAQSection = () => {
  const translation = useTranslation(defaultMediQuuFAQTranslation)
  return (
    <div className={tw('flex flex-col w-full max-w-[1000px]')}>
      <Span type="title" className={tw('text-hw-secondary-400 !text-3xl mb-1')}>{translation.title}</Span>
      <Span>{translation.subTitle}</Span>
      <div className={tw('flex flex-col gap-y-4 mt-8')}>
        <FAQSection
          entries={[
            {
              id: 'Q1',
              title: 'Question 1',
              content: { value: 'Answer 1', type: 'markdown' }
            },
            {
              id: 'Q2',
              title: 'Question 2',
              content: { value: '\\positive{Answer 2}', type: 'markdown' }
            },
            {
              id: 'Q3',
              title: 'Question 3',
              content: { value: 'Answer 3', type: 'markdown' }
            },
            {
              id: 'Q4',
              title: 'Question 4',
              content: { value: '\\b{Answer 4}', type: 'markdown' }
            }
          ]}
          expandableClassName={tw('!py-4 !px-6')}
        />
      </div>
    </div>
  )
}
