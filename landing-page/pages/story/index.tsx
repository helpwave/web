import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StartSection from '@/components/sections/story/StartSection'

const Story: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('max-w-[1000px] mx-auto desktop:px-24 tablet:px-12 mobile:px-6 relative z-[1]')}>
        <StartSection />
      </div>
      <Footer />
    </div>
  )
}

export default Story
