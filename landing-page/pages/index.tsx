import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ExpansionSection from '../components/sections/ExpansionSection'
import PartnerSection from '../components/sections/Partners'
import StartSection from '../components/sections/StartSection'
import StorySection from '../components/sections/Story'

const Home: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8')}>
        <StartSection />
      </div>
      <Divider rotate={3} />
      <div className={tw('desktop:w-5/12 desktop:mx-auto tablet:mx-16 phone:mx-8')}>
        <PartnerSection />
      </div>
      <Divider rotate={3} />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8')}>
        <StorySection />
      </div>
      <div className={tw('w-screen bg-indigo-900 parent')}>
        <div className={tw('w-screen -translate-y-1/2 h-[120px] rotate-[-3deg] bg-white')} />
        <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 text-white')}>
          <ExpansionSection />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
