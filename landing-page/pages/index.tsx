import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import React from 'react'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import Header from '../components/Header'
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
      <Divider />
      <div className={tw('desktop:w-5/12 desktop:mx-auto tablet:mx-16 phone:mx-8')}>
        <PartnerSection />
      </div>
      <Divider />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8')}>
        <StorySection />
      </div>
      <Footer />
    </div>
  )
}

export default Home
