import type { NextPage } from 'next'
import StartSection from '../components/sections/StartSection'
import TeamSection from '../components/sections/TeamSection'
import RoadmapSection from '../components/sections/RoadmapSection'
import ContactSection from '../components/sections/ContactSection'
import PartnerSection from '../components/sections/PartnerSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import { Carousel } from '../components/Carousel'
import { useInView } from 'react-intersection-observer'

const items = [
  { link: '#features', label: 'Features' },
  { link: '#team', label: 'Team' },
  { link: '#partner', label: 'Partners' },
  { link: '#roadmap', label: 'Roadmap' },
  { link: '#contact', label: 'Contact' },
]

const determineBestFit = <Key extends string>(entries: Record<Key, IntersectionObserverEntry | undefined>): Key | undefined => {
  const matches = (Object.entries(entries) as unknown as [Key, IntersectionObserverEntry | undefined][])
    .map(([key, entry]) => {
      if (!entry) return [key, 0] as [Key, number]
      return [key, entry.intersectionRatio] as [Key, number]
    })

  const sortedMatches = matches.sort((a, b) => b[1] - a[1])
  return sortedMatches[0][0]
}

const Home: NextPage = () => {
  /* eslint-disable key-spacing, no-multi-spaces */
  const { ref: startRef,    entry: startEntry    } = useInView({ threshold: 0.1 })
  const { ref: featuresRef, entry: featuresEntry } = useInView({ threshold: 0.1 })
  const { ref: teamRef,     entry: teamEntry     } = useInView({ threshold: 0.1 })
  const { ref: partnerRef,  entry: partnerEntry  } = useInView({ threshold: 0.1 })
  const { ref: roadmapRef,  entry: roadmapEntry  } = useInView({ threshold: 0.1 })
  const { ref: contactRef,  entry: contactEntry  } = useInView({ threshold: 0.1 })
  /* eslint-enable key-spacing, no-multi-spaces */
  const active = determineBestFit({
    start: startEntry,
    features: featuresEntry,
    team: teamEntry,
    partner: partnerEntry,
    roadmap: roadmapEntry,
    contact: contactEntry
  })

  return (
      <>
        <StartSection ref={startRef} />
        <FeaturesSection ref={featuresRef} />
        <TeamSection ref={teamRef} />
        <PartnerSection ref={partnerRef} />
        <RoadmapSection ref={roadmapRef} />
        <ContactSection ref={contactRef} />
        <Carousel items={items} activeLink={active ? `#${active}` : undefined} hidden={active === 'start' || active === undefined} />
      </>
  )
}

export default Home
