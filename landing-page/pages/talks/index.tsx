import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import EpisodeSection from '@/components/sections/talks/EpisodeSection'
import StartSection from '@/components/sections/talks/StartSection'

const Talks: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <StartSection/>
      <EpisodeSection/>
      <Footer/>
    </div>
  )
}

export default Talks
