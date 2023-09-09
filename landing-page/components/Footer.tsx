import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import Link from 'next/link'

const socials = [
  { name: 'GitHub', link: 'https://github.com/helpwave/' },
  { name: 'LinkedIn', link: 'https://linkedin.com/company/helpwave/' },
  { name: 'Instagram', link: 'https://instagram.com/helpwave_de/' },
  { name: 'Twitter', link: 'https://twitter.com/helpwave_org' },
  { name: 'YouTube', link: 'https://www.youtube.com/@helpwave' },
  { name: 'Twitch', link: 'https://www.twitch.tv/helpwave' },
  { name: 'Spotify', link: 'https://open.spotify.com/show/6hL5UMytp81gmURnfn3dS9' },
  { name: 'Apple Podcasts', link: 'https://podcasts.apple.com/us/podcast/helpwave-talks/id1695217116' },
  { name: 'Google Podcasts', link: 'https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9lNTE1NWZhMC9wb2RjYXN0L3Jzcw' },
]

const imprint = [
  { name: 'Imprint', link: 'https://cdn.helpwave.de/imprint.html' },
  { name: 'Contact', link: '/contact' }
]

const Footer = () => {
  return (
    <div className={tw('px-10 h-1/2 w-screen relative bg-black text-white font-space flex flex-wrap items-center  justify-between')}>
      <div className={tw('w-1/4 items-center flex items-center text-2xl select-none')}>
        <Helpwave color="white" /> helpwave
      </div>
      <div className={tw('w-1/4 justify-center')}>
        <Span type="subsectionTitle">Socials</Span>
        {socials.map(({ name, link }) => (
          <div key={link}>
            <Link target="_blank" href={link} className={tw('py-1')}>{name}</Link>
          </div>
        ))}
      </div>

      <div className={tw('w-1/4 justify-center')}>
        <Span type="subsectionTitle">General</Span>
        {imprint.map(({ name, link }) => (
          <div key={link}>
            <Link target="_blank" href={link} className={tw('py-1')}>{name}</Link>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Footer
