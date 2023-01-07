import type { NextPage } from 'next'
import StartSection from '../components/sections/StartSection'
import TeamSection from '../components/sections/TeamSection'
import RoadmapSection from '../components/sections/RoadmapSection'
import ContactSection from '../components/sections/ContactSection'
import PartnerSection from '../components/sections/CustomerSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import { Carousel } from '../components/Carousel'

const items = [
  { link: '#features', label: 'Features' },
  { link: '#team', label: 'Team' },
  { link: '#roadmap', label: 'Roadmap' },
  { link: '#contact', label: 'Contact' },
]

const Home: NextPage = () => {
  return (
      <>
        <StartSection />
        <FeaturesSection />
        <TeamSection />
        <PartnerSection />
        <RoadmapSection />
        <ContactSection />
        <Carousel items={items} activeLink="#team" />
      </>
  )
}

export default Home
