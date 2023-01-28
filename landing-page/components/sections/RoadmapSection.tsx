import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import { useTranslation } from '../../hooks/useTranslation'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import type { Languages } from '../../hooks/useLanguage'

export type RoadmapSectionLanguage = {
  heading: string
}

const defaultRoadmapSectionTranslations: Record<Languages, RoadmapSectionLanguage> = {
  en: {
    heading: 'Roadmap',
  },
  de: {
    heading: 'DE: Roadmap', // TODO: translate (or do we want to leave it in english as is?)
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
