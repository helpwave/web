import type { NextPage } from 'next'
import StoryStartSection from '@/components/sections/story/StoryStartSection'
import StoryHeader from '@/components/sections/story/StoryHeader'
import { Page } from '@/components/Page'

const Story: NextPage = () => {
  return (
    <Page>
      <StoryHeader/>
      <StoryStartSection/>
    </Page>
  )
}

export default Story
