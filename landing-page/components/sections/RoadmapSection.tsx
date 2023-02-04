import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

export type RoadmapSectionLanguage = {
  heading: string
}

const defaultRoadmapSectionTranslations: Record<Languages, RoadmapSectionLanguage> = {
  en: {
    heading: 'Roadmap',
  },
  de: {
    heading: 'Roadmap',
  }
}

const RoadmapSection = forwardRef<HTMLDivElement, PropsWithLanguage<RoadmapSectionLanguage, Record<string, unknown>>>(function RoadmapSection(props, ref) {
  const language = useTranslation(props.language, defaultRoadmapSectionTranslations)
  return (
    <TitleSection id="roadmap" ref={ref} title={language.heading}>

    </TitleSection>
  )
})

export default RoadmapSection
