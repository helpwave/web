import { useEffect } from 'react'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import * as CookieConsent from 'vanilla-cookieconsent'
import { Helpwave } from '@helpwave/common/components/icons/Helpwave'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { Select } from '@helpwave/common/components/user-input/Select'
import pluginConfig from '../utils/CookieConsentConfig'
import FooterLinkGroup from './FooterLinkGroup'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import type { ThemeType, ThemeTypeTranslation } from '@helpwave/common/hooks/useTheme'
import { defaultThemeTypeTranslation } from '@helpwave/common/hooks/useTheme'
import { useTheme } from '@helpwave/common/hooks/useTheme'

type Categories = 'socials'| 'general'| 'products'| 'development'
type FooterTranslation = { [key in Categories]: string } & ThemeTypeTranslation

const defaultFooterTranslation: Record<Languages, FooterTranslation> = {
  en: {
    socials: 'socials',
    general: 'general',
    products: 'products',
    development: 'development',
    ...defaultThemeTypeTranslation.en,
  },
  de: {
    socials: 'social',
    general: 'allgemein',
    products: 'produkte',
    development: 'entwicklung',
    ...defaultThemeTypeTranslation.de,
  }
}

type LinkType = { name: string, link: string, openInCurrentTab?: boolean, onClick?: () => void }
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
  const { theme, setTheme } = useTheme()
  const translation = useTranslation(defaultFooterTranslation, {})

  useEffect(() => {
    CookieConsent.run(pluginConfig)
  }, [])

  return (
    <div className={clsx('w-screen bg-black text-white py-8 col items-center justify-center')}>
      <div className={clsx('flex flex-wrap w-full max-w-[900px] max-tablet:px-6 tablet:px-24 desktop:px-24 mx-auto justify-between')}>
        {grouping.map((groups, index) => (
          <div key={index} className={clsx('col max-tablet:w-full w-[192px] max-tablet:text-center max-tablet:items-center')}>
            {groups.map((category) => (
              <FooterLinkGroup key={category} title={translation[category] } links={linkGroups[category]} />
            ))}
            {index === 2 && (
              <>
                <Select<Languages>
                  value={language}
                  onChange={(language) => setLanguage(language)}
                  options={[
                    { value: 'de', label: 'Deutsch' },
                    { value: 'en', label: 'English' }
                  ]}>
                </Select>
                <Select<ThemeType>
                  value={theme}
                  onChange={(theme) => setTheme(theme)}
                  options={[
                    { value: 'light', label: translation.light },
                    { value: 'dark', label: translation.dark }
                  ]}>
                </Select>
              </>
            )}
          </div>
        ))}
      </div>
      <div
        className={clsx('row w-full h-[128px] items-center justify-center mx-auto font-space')}>
        <Helpwave color="white" size={128}/>
        <span className={clsx('textstyle-title-normal')}>&copy; {year} helpwave</span>
      </div>
    </div>
  )
}

export default Footer
