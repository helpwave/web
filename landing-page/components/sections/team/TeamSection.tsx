import { tw } from '@helpwave/common/twind'
import type { ProfileProps } from '@helpwave/common/components/Profile'
import TeamGroup from '@/components/TeamGroup'

const imageUrl = (key: string) => `https://cdn.helpwave.de/profile/${key}.png`

const teamData: Record<string, ProfileProps[]> = {
  founders: [
    {
      name: 'Max Schäfer',
      roleBadge: 'CTO',
      role: 'Chief Technology Officer',
      imageUrl: imageUrl('max_schaefer'),
      tags: ['development', 'cloud', 'scale'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/maxrobinschaefer/' },
        { type: 'mail', url: 'mailto:max.schaefer@helpwave.de' },
        { type: 'github', url: 'https://github.com/MaxSchaefer' },
      ],
      imageClassName: 'w-[230px] h-[200px]'
    },
    {
      name: 'Felix Evers',
      roleBadge: 'CEO',
      role: 'Chief Executive Officer',
      imageUrl: imageUrl('felix_evers'),
      tags: ['strategic', 'management', 'innovation'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/f-evers/' },
        { type: 'mail', url: 'mailto:felix.evers@helpwave.de' },
        { type: 'website', url: 'https://felixevers.de' },
        { type: 'github', url: 'https://github.com/use-to' },
      ],
      imageClassName: 'w-[230px] h-[200px]'
    },
    {
      name: 'Christian Porschen',
      title: 'Dr. med.',
      role: 'Chief Medical Officer',
      roleBadge: 'CMO',
      imageUrl: imageUrl('christian_porschen'),
      tags: ['ai', 'science', 'doctor'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/cpors/' },
        { type: 'mail', url: 'mailto:christian.porschen@helpwave.de' },
        { type: 'github', url: 'https://github.com/aegis301' },
      ],
      imageClassName: 'w-[230px] h-[200px]'
    },
  ],
  development: [
    {
      name: 'Felix Thape',
      role: 'fullstack wizard',
      imageUrl: imageUrl('felix_thape'),
      tags: ['maintainer', 'web', 'mobile'],
      socials: [
        { type: 'mail', url: 'mailto:felix.thape@helpwave.de' },
        { type: 'github', url: 'https://github.com/DasProffi' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Max Baumann',
      role: 'backend magician',
      imageUrl: imageUrl('max_baumann'),
      tags: ['microservices', 'deployment', 'database'],
      socials: [
        { type: 'mail', url: 'mailto:max.baumann@helpwave.de' },
        { type: 'website', url: 'https://bmn.dev' },
        { type: 'github', url: 'https://github.com/fosefx' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/max-bmn/' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Florian Sabonchi',
      role: 'fullstack sorcerer',
      imageUrl: imageUrl('florian_sabonchi'),
      tags: ['flutter', 'react', 'go'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/florian-s-599819211/' },
        { type: 'mail', url: 'mailto:florian.sabonchi@helpwave.de' },
        { type: 'medium', url: 'https://medium.com/@sabonchi' },
        { type: 'github', url: 'https://github.com/florian-sabonchi' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Paul Kalhorn',
      role: 'fullstack jedi',
      tags: ['microservices', 'web', 'grpc'],
      imageUrl: imageUrl('paul_kalhorn'),
      socials: [
        { type: 'mail', url: 'mailto:paul.kalhorn@helpwave.de' },
        { type: 'website', url: 'https://kalhorn.io/' },
        { type: 'github', url: 'https://github.com/PaulKalho' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/paul-kalhorn-7b2343228/' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Jonas Ester',
      role: 'ui/ux prodigy',
      tags: ['uiux', 'web', 'mobile'],
      imageUrl: imageUrl('jonas_ester'),
      socials: [
        { type: 'mail', url: 'mailto:jonas.ester@helpwave.de' },
        { type: 'website', url: 'https://www.jonasester.de/' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/jonas-ester-b063a8188/' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    }
  ],
  medical: [
    {
      name: 'Ludwig Maidowski',
      role: 'medical professional & legal',
      tags: ['law', 'doctor', 'product'],
      imageUrl: imageUrl('ludwig_maidowski'),
      socials: [
        { type: 'mail', url: 'mailto:ludwig.maidowski@helpwave.de' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/ludwig-maidowski-896b83208/' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Sophia Ehlers',
      role: 'medical professional',
      imageUrl: imageUrl('sophia_ehlers'),
      tags: ['doctor', 'medicine', 'product'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/sophia-ehlers/' },
        { type: 'mail', url: 'mailto:sophia.ehlers@helpwave.de' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
    {
      name: 'Pierre Dürgen',
      role: 'medical professional',
      imageUrl: imageUrl('pierre_duergen'),
      tags: ['doctor', 'medicine', 'product'],
      socials: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/pierre-d-02239011a/' },
        { type: 'mail', url: 'mailto:pierre.duergen@helpwave.de' },
      ],
      imageClassName: 'w-[200px] h-[200px]'
    },
  ],
}

const TeamSection = () => {
  return (
    <div className={tw('pt-32 pb-16')}>
      {Object.entries(teamData).map(([name, members]) => (
        <TeamGroup key={name} name={name} members={members} />
      ))}
    </div>
  )
}

export default TeamSection
