import { useLanguage, type Languages } from '@helpwave/common/hooks/useLanguage'
import type { ProfileProps } from '@helpwave/common/components/Profile'
import { Profile } from '@helpwave/common/components/Profile'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import { MediQuuBadge } from '@/components/sections/mediQuu/MediQuuBadge'
import { SectionBase } from '@/components/sections/SectionBase'

const imageUrl = (key: string) => `https://cdn.helpwave.de/profile/${key}.png`

const contactsHelpwave: (ProfileProps & { translatedInfo?: Record<Languages, string> })[] = [
  {
    name: 'Felix Evers',
    roleBadge: 'CEO',
    role: 'Chief Executive Officer',
    imageUrl: imageUrl('felix_evers'),
    badge: (
      <HelpwaveBadge
        size="small"
        className="bg-black !gap-x-1 !w-fit"
      />
    ),
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/f-evers/' },
      { type: 'mail', url: 'mailto:felix.evers@helpwave.de' },
      { type: 'website', url: 'https://felixevers.de' },
      { type: 'github', url: 'https://github.com/use-to' },
    ],
    imageClassName: '!w-[230px] !h-[200px]'
  },
  {
    name: 'Christian Porschen',
    prefix: 'Dr. med.',
    role: 'Chief Medical Officer',
    roleBadge: 'CMO',
    imageUrl: imageUrl('christian_porschen'),
    badge: (
      <HelpwaveBadge
        size="small"
        className="bg-black !gap-x-1 !w-fit"
      />
    ),
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/cpors/' },
      { type: 'mail', url: 'mailto:christian.porschen@helpwave.de' },
      { type: 'github', url: 'https://github.com/aegis301' },
    ],
    imageClassName: '!w-[230px] !h-[200px]'
  },
  {
    name: 'Ludwig Maidowski',
    prefix: 'Dr. med., Dipl.-Jur.',
    suffix: 'Maître en droit, Paris II',
    role: 'Chief Legal Officer',
    roleBadge: 'CLO',
    tags: ['law', 'doctor', 'product'],
    imageUrl: imageUrl('ludwig_maidowski'),
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/ludwig-maidowski-896b83208/' },
      { type: 'mail', url: 'mailto:ludwig.maidowski@helpwave.de' },
    ],
    imageClassName: 'w-[200px] h-[200px]'
  },
]

const contactsMediquu: (ProfileProps & { translatedInfo?: Record<Languages, string> })[] = [
  {
    name: 'Christian Remfert',
    roleBadge: 'Advisor',
    badge: <MediQuuBadge/>,
    imageUrl: 'https://cdn.helpwave.de/mediquu/christian_remfert.jpg',
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/christian-remfert/' },
    ],
    imageClassName: '!w-[230px] !h-[200px]',
    translatedInfo: {
      de: 'Zuständig für die konzeptionelle und technische Umsetzung der mediQuu-Plattform, zukünftig beratend tätig.',
      en: 'Responsible for the conceptual and technical implementation of the mediQuu platform, providing advisory services in the future.'
    },
    className: 'w-500px'
  },
  {
    name: 'Peter Körner',
    roleBadge: 'Advisor',
    badge: <MediQuuBadge/>,
    imageUrl: 'https://cdn.helpwave.de/mediquu/peter_koerner.jpg',
    socials: [
      { type: 'mail', url: 'mailto:koerner@mediquu.de' },
    ],
    imageClassName: '!w-[230px] !h-[200px]',
    translatedInfo: {
      de: 'Zuständig für die konzeptionelle und visuelle Umsetzung der mediQuu-Plattform, zukünftig beratend tätig.',
      en: 'Responsible for the conceptual and visual implementation of the mediQuu platform, providing advisory services in the future.'
    }
  },
]

type TeamSectionTranslation = {
  title: string,
  subTitle: string,
}

const defaultTeamSectionTranslation: Record<Languages, TeamSectionTranslation> = {
  en: {
    title: 'Contacts',
    subTitle: 'We are available to answer any questions you may have at short notice.',
  },
  de: {
    title: 'Ansprechpartner',
    subTitle: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
  }
}

export const TeamSection = () => {
  const translation = useTranslation(defaultTeamSectionTranslation)
  const usedLanguage = useLanguage().language
  return (
    <SectionBase className={clsx('flex flex-col')}>
      <span className={clsx('textstyle-title-xl text-hw-secondary-400 mb-1')}>{translation.title}</span>
      <span>{translation.subTitle}</span>
      <div className={clsx('flex flex-wrap justify-around gap-x-8 gap-y-6 mt-8')}>
        {contactsHelpwave.map(value => {
          const profileProps = { ...value }
          delete profileProps.translatedInfo
          return (
            <Profile
              key={value.name}
              info={value.translatedInfo ? value.translatedInfo[usedLanguage] : undefined}
              {...profileProps}
              className={clsx('drop-shadow-lg hover:drop-shadow-3xl border-1', value.className)}
            />
          )
        })}
      </div>
      <div className={clsx('flex flex-wrap justify-around gap-x-8 gap-y-6 mt-6')}>
        {contactsMediquu.map(value => {
          const profileProps = { ...value }
          delete profileProps.translatedInfo
          return (
            <Profile
              key={value.name}
              info={value.translatedInfo ? value.translatedInfo[usedLanguage] : undefined}
              {...profileProps}
              className={clsx('drop-shadow-lg hover:drop-shadow-3xl border-1', value.className)}
            />
          )
        })}
      </div>
    </SectionBase>
  )
}
