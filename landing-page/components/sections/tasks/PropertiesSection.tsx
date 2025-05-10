import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TagIcon } from '@helpwave/common/components/icons/Tag'
import { SectionBase } from '@/components/sections/SectionBase'

type PropertiesSectionTranslation = {
  title: string,
  description: string,
  properties: string,
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
      outerClassName="desktop:py-0 tablet:py-0"
      className="max-tablet:flex max-tablet:flex-wrap max-tablet:justify-center tablet:row tablet:justify-between w-full !gap-x-16 gap-y-8 items-center"
    >
      <div
        className="row bottom-0 justify-center rounded-l-3xl max-tablet:w-full min-w-[40%] w-2/5 z-10"
      >
        <Image
          src={imageUrl}
          alt=""
          width={443}
          height={649}
          className="max-h-[70vh]"
        />
      </div>
      <div className="col gap-y-2 pb-16 max-tablet:pb-0">
        <div className="col gap-y-2">
          <div className="row gap-x-1 text-primary items-center">
            <TagIcon/>
            <span className="textstyle-title-normal">{translation.properties}</span>
          </div>
          <h1 className="textstyle-title-2xl">{translation.title}</h1>
          <span className="font-space font-semibold"><MarkdownInterpreter text={translation.description}/></span>
        </div>
      </div>
    </SectionBase>
  )
}
