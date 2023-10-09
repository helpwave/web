import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PartnerSection from '../components/sections/Partners'
import StartSection from '../components/sections/StartSection'
import StorySection from '../components/sections/Story'

const Home: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent overflow-x-hidden')} id="start">
      <Header />
      <div className={tw('w-5/12 mx-auto')}>
        <StartSection />
        <PartnerSection />
        <StorySection />
      </div>
      <Footer />
    </div>
  )
}

export default Home
