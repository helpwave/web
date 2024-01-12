import { tw } from '@helpwave/common/twind'
import TeamGroup from '@/components/TeamGroup'
import type { TeamMemberProps } from '@/components/TeamMember'

const pictureURL = (key: string) => `https://cdn.helpwave.de/profile/${key}.png`

const teamData = {
  'founders': [
    {
      name: 'Max Schäfer',
      role: 'Chief Technology Officer',
      pictureURL: pictureURL('max_schaefer'),
      tags: ['development', 'cloud', 'scale'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/maxrobinschaefer/' },
        { name: 'mail', url: 'mailto:max.schaefer@helpwave.de' },
        { name: 'github', url: 'https://github.com/MaxSchaefer' },
      ]
    },
    {
      name: 'Felix Evers',
      role: 'Chief Executive Officer',
      pictureURL: pictureURL('felix_evers'),
      tags: ['strategic', 'management', 'innovation'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/f-evers/' },
        { name: 'mail', url: 'mailto:felix.evers@helpwave.de' },
        { name: 'website', url: 'https://felixevers.de' },
        { name: 'github', url: 'https://github.com/use-to' },
      ]
    },
    {
      name: 'Christian Porschen',
      title: 'Dr. med.',
      role: 'Chief Medical Officer',
      pictureURL: pictureURL('christian_porschen'),
      tags: ['ai', 'science', 'doctor'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/cpors/' },
        { name: 'mail', url: 'mailto:christian.porschen@helpwave.de' },
        { name: 'github', url: 'https://github.com/aegis301' },
      ]
    },
  ],
  'management': [
    {
      name: 'Yvonne Steernberg',
      title: 'Dr. phil., Dipl-Betriebswirtin',
      role: 'Scientific Project Manager',
      pictureURL: pictureURL('yvonne_steernberg'),
      tags: ['funding', 'sales', 'hospitalmanagement'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/dr-phil-yvonne-m-a-steernberg-180786137/' },
        { name: 'mail', url: 'mailto:yvonne.steernberg.de' },
      ]
    },
  ],
  'development': [
    {
      name: 'Felix Thape',
      role: 'fullstack wizard',
      pictureURL: pictureURL('felix_thape'),
      tags: ['maintainer', 'web', 'mobile'],
      socials: [
        { name: 'mail', url: 'mailto:felix.thape@helpwave.de' },
        { name: 'github', url: 'https://github.com/DasProffi' },
      ]
    },
    {
      name: 'Max Baumann',
      role: 'backend magician',
      pictureURL: pictureURL('max_baumann'),
      tags: ['microservices', 'deployment', 'database'],
      socials: [
        { name: 'mail', url: 'mailto:max.baumann@helpwave.de' },
        { name: 'website', url: 'https://bmn.dev' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/max-bmn/' },
      ]
    },
    {
      name: 'Florian Sabonchi',
      role: 'fullstack sorcerer',
      pictureURL: pictureURL('florian_sabonchi'),
      tags: ['flutter', 'react', 'go'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/florian-s-599819211/' },
        { name: 'mail', url: 'mailto:florian.sabonchi@helpwave.de' },
        { name: 'github', url: 'https://github.com/florian-sabonchi' },
      ]
    },
    {
      name: 'Paul Kalhorn',
      role: 'fullstack jedi',
      tags: ['microservices', 'web', 'grpc'],
      pictureURL: pictureURL('paul_kalhorn'),
      socials: [
        { name: 'mail', url: 'mailto:paul.kalhorn@helpwave.de' },
        { name: 'website', url: 'https://kalhorn.io/' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/paul-kalhorn-7b2343228/' },
      ]
    },
    {
      name: 'Jonas Ester',
      role: 'ui/ux prodigy',
      tags: ['uiux', 'web', 'mobile'],
      pictureURL: pictureURL('jonas_ester'),
      socials: [
        { name: 'mail', url: 'mailto:jonas.ester@helpwave.de' },
        { name: 'website', url: 'https://www.jonasester.de/' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/jonas-ester-b063a8188/' },
      ]
    },
    {
      name: 'Friedjof Noweck',
      role: 'backend developer',
      pictureURL: pictureURL('friedjof_noweck'),
      tags: ['microservices', 'python', 'database'],
      socials: [
        { name: 'mail', url: 'mailto:friedjof.noweck@helpwave.de' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/friedjof-noweck-02a4401aa/' },
        { name: 'github', url: 'https://github.com/friedjof/' },
      ]
    },
  ],
  'medical': [
    {
      name: 'Ludwig Maidowski',
      role: 'medical professional & legal',
      tags: ['law', 'doctor', 'product'],
      pictureURL: pictureURL('ludwig_maidowski'),
      socials: [
        { name: 'mail', url: 'mailto:ludwig.maidowski@helpwave.de' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/ludwig-maidowski-896b83208/' },
      ]
    },
    {
      name: 'Sophia Ehlers',
      role: 'medical professional',
      pictureURL: pictureURL('sophia_ehlers'),
      tags: ['doctor', 'medicine', 'product'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/sophia-ehlers/' },
        { name: 'mail', url: 'mailto:sophia.ehlers@helpwave.de' },
      ]
    },
    {
      name: 'Pierre Dürgen',
      role: 'medical professional',
      pictureURL: pictureURL('pierre_duergen'),
      tags: ['doctor', 'medicine', 'product'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/pierre-d-02239011a/' },
        { name: 'mail', url: 'mailto:pierre.duergen@helpwave.de' },
      ]
    },
  ],
  'support': [
    {
      name: 'Yari Hernandez',
      role: 'sales genius',
      pictureURL: pictureURL('yari_hernandez'),
      tags: ['marketing', 'business', 'backoffice'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/yarimar-fajardo-hernandez-66b603272/' },
        { name: 'mail', url: 'mailto:yari.hernandez@helpwave.de' },
      ]
    },
    {
      name: 'Jonas Evers',
      role: 'allrounder',
      pictureURL: pictureURL('jonas_evers'),
      tags: ['organization', 'marketing', 'events'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/jonas-evers/' },
        { name: 'mail', url: 'mailto:jonas.evers@helpwave.de' },
      ]
    },
  ],
}

const TeamSection = () => {
  return (
    <div className={tw('pt-32 pb-16')}>
      {Object.entries(teamData).map(([name, members]) => (
        <TeamGroup key={name} name={name} members={members as TeamMemberProps[]} />
      ))}
    </div>
  )
}

export default TeamSection
