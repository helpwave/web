import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../components/Footer'
import Header from '../components/Header'
import StartSection from '../components/sections/StartSection'

const Home: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent overflow-x-hidden')} id="start">
      <Header />
      <StartSection />
      <Footer />
    </div>
  )
}

export default Home
