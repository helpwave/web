import type { NextPage } from 'next'
import StoryHeader from '@/components/sections/story/StoryHeader'
import { Page } from '@/components/Page'
import { StorySliderSection } from '@/components/sections/landing/StoriesSliderSection'

const Story: NextPage = () => {
  return (
    <Page>
      <StoryHeader/>
      <StorySliderSection/>
    </Page>
  )
}

export default Story
