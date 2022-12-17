import type { NextPage } from 'next'
import StartSection from '../components/StartSection'
import TeamSection from '../components/TeamSection'
import RoadmapSection from '../components/RoadmapSection'
import ContactSection from '../components/ContactSection'

const Home: NextPage = () => {
  return (
      <>
        <StartSection />
        <TeamSection />
        <RoadmapSection />
        <ContactSection />
      </>
  )
}

export default Home
