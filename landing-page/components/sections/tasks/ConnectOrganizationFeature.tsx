import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { ItemGrid } from '@helpwave/common/components/layout/ItemGrid'
import { SectionBase } from '@/components/sections/SectionBase'

type ConnectOrganizationFeatureSectionTranslation = {
  title: string,
  description: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string,
  feature5: string,
  feature6: string
}

const defaultConnectOrganizationFeatureSectionTranslation: Record<Languages, ConnectOrganizationFeatureSectionTranslation> = {
  en: {
    title: 'Connect your organization in one tool',
    description: '\\b{helpwave tasks} enables you to manage tasks and patients across your entire organization.',
    feature1: 'Feature 1',
    feature2: 'Feature 2',
    feature3: 'Feature 3',
    feature4: 'Feature 4',
    feature5: 'Feature 5',
    feature6: 'Feature 6',
  },
  de: {
    title: 'Verbinden Sie Ihr Organisation mit nur einem Tool',
    description: '\\b{helpwave tasks} ermöglicht die Verwaltung von Aufgaben und Patienten über die gesamte Organisation hinweg.',
    feature1: 'Feature 1',
    feature2: 'Feature 2',
    feature3: 'Feature 3',
    feature4: 'Feature 4',
    feature5: 'Feature 5',
    feature6: 'Feature 6',
  }
}

export const ConnectOrganizationFeatureSection = ({ overwriteTranslation }: PropsForTranslation<ConnectOrganizationFeatureSectionTranslation>) => {
  const translation = useTranslation(defaultConnectOrganizationFeatureSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/tasks_ward_overview.png'

  const features = [translation.feature1, translation.feature2, translation.feature3,
    translation.feature4, translation.feature5, translation.feature6]
  const featureStyle = tw('font-semibold')

  return (
    <SectionBase
      className={tw('flex flex-row mobile:!flex-wrap-reverse w-full !max-w-full gap-8 justify-between mobile:justify-end items-center !pr-0')}
      backgroundColor="gray"
    >
      <div className={tw('flex flex-col items-center flex-1 mobile:pr-6')}>
        <div className={tw('flex flex-col gap-y-2 max-w-[500px]')}>
          <h1><Span type="title" className={tw('!text-4xl')}>{translation.title}</Span></h1>
          <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
          <ItemGrid className={tw('mt-2')}>
            {features.map((feature, index) => (<Span key={index} className={featureStyle}>{feature}</Span>))}
          </ItemGrid>
        </div>
      </div>
      <div
        // TODO fix image size and add dashed lines
        className={tw('relative right-0 rounded-l-3xl w-2/5 tablet:min-w-[360px] mobile:w-4/5 z-10')}>
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className={tw('w-full object-cover ')}
        />
      </div>
    </SectionBase>
  )
}
