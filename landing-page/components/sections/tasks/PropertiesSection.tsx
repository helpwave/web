import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type PropertiesSectionTranslation = {
  title: string,
  description: string,
  properties: string
}

const defaultPropertiesSectionTranslation: Record<Languages, PropertiesSectionTranslation> = {
  en: {
    title: 'Everything you need at a glance',
    description: 'Tired of searching for allergy records? Keep track of the facts.',
    properties: 'Properties'
  },
  de: {
    title: 'Alles, was Sie brauchen, auf einen Blick',
    description: 'Müde von der Suche nach Allergiedaten? Behalten Sie den Überblick über die Fakten.',
    properties: 'Properties'
  }
}

export const PropertiesSection = ({ overwriteTranslation }: PropsForTranslation<PropertiesSectionTranslation>) => {
  const translation = useTranslation(defaultPropertiesSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/properties.png'

  return (
    <SectionBase
      outerClassName={tw('desktop:py-0 tablet:py-0')}
      className={tw('flex flex-row mobile:!flex-wrap w-full gap-x-16 gap-y-8 justify-between mobile:justify-center items-center')}
    >
      <div
        className={tw('flex flex-row bottom-0 justify-center rounded-l-3xl mobile:w-full min-w-[40%] w-2/5 z-10')}
      >
        <Image
          src={imageUrl}
          alt=""
          width={443}
          height={649}
          className={tw('max-h-[70vh]')}
        />
      </div>
      <div className={tw('flex flex-col gap-y-2 pb-16 mobile:pb-0')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <div className={tw('flex flex-row gap-x-1 text-hw-primary-800 items-center')}>
            <TagIcon/>
            <span className={tw('textstyle-title-normal')}>{translation.properties}</span>
          </div>
          <h1 className={tw('textstyle-title-2xl')}>{translation.title}</h1>
          <span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
    </SectionBase>
  )
}
