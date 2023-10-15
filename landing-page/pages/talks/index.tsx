import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import EpisodeSection from '../../components/sections/talks/EpisodeSection'
import StartSection from '../../components/sections/talks/StartSection'

const Talks: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <StartSection />
      </div>
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <EpisodeSection />
      </div>
      <Footer />
    </div>
  )
}

export default Talks
