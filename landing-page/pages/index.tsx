import type { NextPage } from 'next'
import StartSection from '../components/StartSection'
import TeamSection from '../components/TeamSection'
import RoadmapSection from '../components/RoadmapSection'
import ContactSection from '../components/ContactSection'
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
        <TeamSection />
        <RoadmapSection />
        <ContactSection />
        <Carousel items={items} activeLink="#team" />
      </>
  )
}

export default Home
