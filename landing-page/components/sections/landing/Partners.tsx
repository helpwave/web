import { tw } from '@helpwave/common/twind'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'

type Entry = {
  name: string,
  url: string
}

const images: Record<string, Entry> = {
  mediQuu: {
    name: 'mediQuu',
    url: 'https://cdn.helpwave.de/mediquu/logo_2021.png'
  },
  reach: {
    name: 'REACH',
    url: 'https://cdn.helpwave.de/partners/reach.svg'
  },
  digitalHub: {
    name: 'Digital Hub münsterLAND',
    url: 'https://cdn.helpwave.de/partners/digitalhub_muensterland.png'
  },
  muensterHack: {
    name: 'Münsterhack',
    url: 'https://cdn.helpwave.de/partners/mshack_2023.png',
  }
}

const PartnerSection = () => {
  const size = 144

  return (
    <SectionBase className={tw('flex gap-16 select-none overflow-x-auto justify-between items-center')}>
      {Object.entries(images).map(([_, { name, url }]) => (
        <Image key={name} alt={name} src={url} style={{ objectFit: 'contain' }} width={size} height={size} className={tw('grayscale')} />
      ))}
    </SectionBase>
  )
}

export default PartnerSection
