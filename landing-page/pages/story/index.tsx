import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import StoryHeader from '@/components/sections/story/StoryHeader'
import { Page } from '@/components/Page'
import { StorySliderSection } from '@/components/sections/landing/StoriesSliderSection'

type StoryTranslation = {
  title: string
}

const defaultStoryTranslation: Record<Languages, StoryTranslation> = {
  en: {
    title: 'Story',
  },
  de: {
    title: 'Story',
  }
}

const Story: NextPage = () => {
  const translation = useTranslation(defaultStoryTranslation)
  return (
    <Page pageTitleAddition={translation.title}>
      <StoryHeader/>
      <StorySliderSection/>
    </Page>
  )
}

export default Story
