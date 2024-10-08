import { useEffect } from 'react'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import * as CookieConsent from 'vanilla-cookieconsent'
import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { Select } from '@helpwave/common/components/user-input/Select'
import pluginConfig from '../utils/CookieConsentConfig'
import FooterLinkGroup from './FooterLinkGroup'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const categories = ['socials', 'general', 'products', 'development'] as const
type Categories = typeof categories[number]
type FooterTranslation = { [key in Categories]: string }

const defaultFooterTranslation: Record<Languages, FooterTranslation> = {
  en: {
    socials: 'socials',
    general: 'general',
    products: 'products',
    development: 'development',
  },
  de: {
    socials: 'social',
    general: 'allgemein',
    products: 'produkte',
    development: 'entwicklung',
  }
}

type LinkType = {name: string, link: string, openInCurrentTab?: boolean, onClick?: () => void}
const linkGroups: Record<Categories, LinkType[]> = {
  socials: [
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
  ],
  development: [
    { name: 'Status', link: 'https://helpwave.betteruptime.com/' },
    { name: 'web', link: 'https://github.com/helpwave/web' },
    { name: 'mobile-app', link: 'https://github.com/helpwave/mobile-app' },
    { name: 'services', link: 'https://github.com/helpwave/services' },
    { name: 'helpwave tasks (staging)', link: 'https://staging-tasks.helpwave.de' },
  ],
  general: [
    { name: 'Support', link: 'https://support.helpwave.de' },
    { name: 'Imprint', link: 'https://cdn.helpwave.de/imprint.html' },
    { name: 'Privacy', link: 'https://cdn.helpwave.de/privacy.html' },
    { name: 'Cookies', link: '', onClick: () => CookieConsent.showPreferences() },
    { name: 'Contact', link: 'mailto:contact@helpwave.de' },
    { name: 'Pitchdeck', link: 'https://cdn.helpwave.de/helpwave_pitchdeck.pdf' },
    { name: 'Onepager', link: 'https://cdn.helpwave.de/helpwave_onepager.pdf' },
    { name: 'LOI', link: 'https://cdn.helpwave.de/helpwave_letter_of_intent.pdf' },
    { name: 'Tech-Radar', link: '/tech-radar', openInCurrentTab: true },
    { name: 'Credits', link: '/credits', openInCurrentTab: true },
  ],
  products: [
    { name: 'helpwave tasks', link: '/product/tasks' },
    { name: 'App Zum Doc', link: 'https://app-zum-doc.de/' },
    { name: 'mediQuu Netzmanager', link: 'https://mediquu.de/mediquu_netzmanager.html' },
    /* { name: 'scaffold', link: '/product/scaffold' },
      { name: 'cloud', link: '/product/cloud' },
      { name: 'impulse', link: '/product/impulse' },
      { name: 'analytics', link: '/product/analytics' },
      { name: 'core', link: '/product/core' }, */
  ]
}

const grouping: (Categories[])[] = [
  ['socials'],
  ['general', 'products'],
  ['development']
]

const Footer = () => {
  const year = new Date().getFullYear()
  const { language, setLanguage } = useLanguage()
  const translation = useTranslation(defaultFooterTranslation, {})

  useEffect(() => {
    CookieConsent.run(pluginConfig)
  }, [])

  return (
    <div className={tw('w-screen bg-black text-white py-8 flex flex-col items-center justify-center')}>
      <div className={tw('flex flex-wrap w-full max-w-[900px] mobile:px-6 tablet:px-24 desktop:px-24 mx-auto justify-between')}>
        {grouping.map((groups, index) => (
          <div key={index} className={tw('flex flex-col mobile:w-full w-[192px] mobile:text-center mobile:items-center')}>
            {groups.map((category) => (
              <FooterLinkGroup key={category} title={translation[category] } links={linkGroups[category]} />
            ))}
            {index === 2 && (
                <Select<Languages>
                  className={tw('w-fit')}
                  textColor={tw('text-white bg-transparent')}
                  hoverColor={tw('hover:text-white')}
                  value={language}
                  onChange={(language) => setLanguage(language)}
                  options={[
                    { value: 'de', label: 'Deutsch' },
                    { value: 'en', label: 'English' }
                  ]}>
                </Select>
            )}
          </div>
        ))}
      </div>
      <div
        className={tw('flex flex-row justify-center w-full h-[128px] items-center justify-center mx-auto font-space')}>
        <Helpwave color="white" size={128}/>
        <Span type="subsectionTitle">&copy; {year} helpwave</Span>
      </div>
    </div>
  )
}

export default Footer
