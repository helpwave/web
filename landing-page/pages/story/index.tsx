import type { NextPage } from 'next'
import StoryHeader from '@/components/sections/story/StoryHeader'
import { Page } from '@/components/Page'
import { StorySliderSection } from '@/components/sections/landing/StoriesSliderSection'
import StoryInUseAtSection from '@/components/sections/story/StoryInUseAtSection'

const Story: NextPage = () => {
  return (
    <Page>
      <StoryHeader/>
      <StorySliderSection/>
      <StoryInUseAtSection/>
    </Page>
  )
}

export default Story
