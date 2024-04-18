import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import EpisodeSection from '@/components/sections/talks/EpisodeSection'
import StartSection from '@/components/sections/talks/StartSection'

const Talks: NextPage = () => {
  const sectionClassName = tw('max-w-[1000px] mx-auto desktop:px-24 tablet:px-12 mobile:mx-6 relative z-[1]')

  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw(sectionClassName)}>
        <StartSection />
      </div>
      <div className={tw(sectionClassName)}>
        <EpisodeSection />
      </div>
      <Footer />
    </div>
  )
}

export default Talks
