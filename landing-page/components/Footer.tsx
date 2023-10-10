import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import FooterLinkGroup from './FooterLinkGroup'

const linkGroups = [
  {
    Socials: [
      { name: 'GitHub', link: 'https://github.com/helpwave/' },
      { name: 'LinkedIn', link: 'https://linkedin.com/company/helpwave/' },
      { name: 'Instagram', link: 'https://instagram.com/helpwave_de/' },
      { name: 'Twitter', link: 'https://twitter.com/helpwave_org' },
      { name: 'YouTube', link: 'https://www.youtube.com/@helpwave' },
      { name: 'Twitch', link: 'https://www.twitch.tv/helpwave' },
      { name: 'Spotify', link: 'https://open.spotify.com/show/6hL5UMytp81gmURnfn3dS9' },
      { name: 'Apple Podcasts', link: 'https://podcasts.apple.com/us/podcast/helpwave-talks/id1695217116' },
      { name: 'Google Podcasts', link: 'https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9lNTE1NWZhMC9wb2RjYXN0L3Jzcw' },
      { name: 'Slack', link: 'https://helpwave.slack.com' },
    ]
  },

  {
    General: [
      { name: 'Imprint', link: 'https://cdn.helpwave.de/imprint.html' },
      { name: 'Privacy', link: 'https://cdn.helpwave.de/privacy.html' },
      { name: 'Contact', link: 'mailto:contact@helpwave.de' },
      { name: 'Pitchdeck', link: 'https://cdn.helpwave.de/helpwave_pitchdeck.pdf' },
      { name: 'Onepager', link: 'https://cdn.helpwave.de/helpwave_onepager.pdf' },
      { name: 'LOI', link: 'https://cdn.helpwave.de/helpwave_letter_of_intent.pdf' }
    ],
    Products: [
      { name: 'scaffold', link: '/scaffold' },
      { name: 'tasks', link: 'https://tasks.helpwave.de' },
      { name: 'cloud', link: '/cloud' },
      { name: 'impulse', link: '/impulse' },
      { name: 'analytics', link: '/analytics' },
      { name: 'core', link: '/core' },
    ]
  },

  {
    Development: [
      { name: 'Status', link: 'https://helpwave.betteruptime.com/' },
      { name: 'web', link: 'https://github.com/helpwave/web' },
      { name: 'mobile-app', link: 'https://github.com/helpwave/mobile-app' },
      { name: 'services', link: 'https://github.com/helpwave/services' },
      { name: 'Environment ~ tasks', link: 'https://staging-tasks.helpwave.de' },
      { name: 'Bug Bounty Program', link: 'https://github.com/helpwave/web/issues' },
    ]
  },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div className={tw('w-screen bg-black text-white py-[64px] flex items-center justify-center')}>
      <div className={tw('mobile:w-full mobile:p-16 desktop:w-5/12 flex flex-wrap mx-auto justify-between')}>
        {linkGroups.map((group, index) => (
          <div key={index} className={tw('mobile:w-full desktop:w-[192px] mobile:text-center')}>
            {Object.entries(group).map(([title, links]) => (
              <FooterLinkGroup key={title} title={title} links={links}></FooterLinkGroup>
            ))}
          </div>
        ))}

        <div className={tw('mobile:w-full items-center justify-center desktop:w-[192px] mx-auto h-[128px] font-space flex flex-wrap mobile:justify-center')}>
          <Helpwave color="white" size={128} />
          <Span type="subsectionTitle">&copy; {year} helpwave</Span>
        </div>
      </div>
    </div>
  )
}

export default Footer
