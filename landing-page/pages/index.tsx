import type { NextPage } from 'next'
import StartSection from '../components/StartSection'
import TeamSection from '../components/TeamSection'
import RoadmapSection from '../components/RoadmapSection'
import ContactUsSection from '../components/ContactUsSection'

const Home: NextPage = () => {
  return (
      <>
        <StartSection />
        <TeamSection />
        <RoadmapSection />
        <ContactUsSection />
      </>
  )
}

export default Home
