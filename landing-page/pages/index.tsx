import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Navigation from '../components/Navigation'
import StartSection from '../components/sections/StartSection'

const Home: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white')} id="start">
      <Navigation />
      <StartSection />
    </div>
  )
}

export default Home
