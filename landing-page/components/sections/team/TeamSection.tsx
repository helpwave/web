import { tw } from '@helpwave/common/twind'
import TeamGroup from '../../TeamGroup'
import type { TeamMemberProps } from '../../TeamMember'

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
      tags: ['strategic', 'management', 'business'],
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
      tags: ['socialmedia', 'medicine', 'doctor'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/cpors/' },
        { name: 'mail', url: 'mailto:christian.porschen@helpwave.de' },
        { name: 'github', url: 'https://github.com/aegis301' },
      ]
    },
    {
      name: 'Yvonne Steernberg',
      title: 'Dr. phil., Dipl-Betriebswirtin',
      role: 'Chief Business Officer',
      pictureURL: pictureURL('yvonne_steernberg'),
      tags: ['sales', 'marketing', 'hospitalmanagement'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/dr-phil-yvonne-m-a-steernberg-180786137/' },
        { name: 'mail', url: 'mailto:yvonne.steernberg.de' },
      ]
    },
  ],
  'development': [
    {
      name: 'Felix Thape',
      role: 'fullstack developer',
      pictureURL: pictureURL('felix_thape'),
      tags: ['maintainer', 'web', 'mobile'],
      socials: [
        { name: 'mail', url: 'mailto:felix.thape@helpwave.de' },
        { name: 'github', url: 'https://github.com/DasProffi' },
      ]
    },
    {
      name: 'Florian Sabonchi',
      role: 'fullstack developer',
      pictureURL: pictureURL('florian_sabonchi'),
      tags: ['flutter', 'react', 'go'],
      socials: [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/florian-s-599819211/' },
        { name: 'mail', url: 'mailto:florian.sabonchi@helpwave.de' },
        { name: 'github', url: 'https://github.com/florian-sabonchi' },
      ]
    },
    {
      name: 'Max Baumann',
      role: 'backend magician',
      pictureURL: pictureURL('max_baumann'),
      tags: ['microservices', 'deployment', 'database'],
      socials: [
        { name: 'mail', url: 'mailto:max.baumann@helpwave.de' },
        { name: 'website', url: 'https://fosefx.com' },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/max-bmn/' },
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
      socials: [
        { name: 'mail', url: 'mailto:ludwig.maidowski@helpwave.de' },
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
  'sales & marketing': [
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
