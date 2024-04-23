import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StoryStartSection from '@/components/sections/story/StoryStartSection'

const Story: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <StoryHeader/>
      <StoryStartSection/>
      <Footer/>
    </div>
  )
}

export default Story
