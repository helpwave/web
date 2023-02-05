import type { NextPage } from 'next'
import StartSection from '../components/sections/StartSection'
import PartnersTeamSection from '../components/sections/TeamSection'
import ContactSection from '../components/sections/ContactSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import { Carousel } from '../components/Carousel'
import { useInView } from 'react-intersection-observer'

const items = [
  { link: '#features', label: 'Features' },
  { link: '#partners_team', label: 'Partners & Team' },
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
  const { ref: startRef,        entry: startEntry       } = useInView({ threshold: 0.1 })
  const { ref: featuresRef,     entry: featuresEntry    } = useInView({ threshold: 0.1 })
  const { ref: partnersteamRef, entry: partnerTeamEntry } = useInView({ threshold: 0.1 })
  const { ref: contactRef,      entry: contactEntry     } = useInView({ threshold: 0.1 })
  /* eslint-enable key-spacing, no-multi-spaces */
  const active = determineBestFit({
    start: startEntry,
    features: featuresEntry,
    partners_team: partnerTeamEntry,
    contact: contactEntry
  })

  return (
      <>
        <StartSection ref={startRef} />
        <FeaturesSection ref={featuresRef} />
        <PartnersTeamSection ref={partnersteamRef} />
        <ContactSection ref={contactRef} />
        <Carousel items={items} activeLink={active ? `#${active}` : undefined} hidden={active === 'start' || active === undefined} />
      </>
  )
}

export default Home
